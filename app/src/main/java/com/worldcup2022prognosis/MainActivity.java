package com.worldcup2022prognosis;

import android.content.Intent;
import android.os.Bundle;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import com.facebook.CallbackManager;
import com.google.android.gms.ads.*;
import com.google.android.gms.ads.interstitial.InterstitialAd;
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback;

public class MainActivity extends AppCompatActivity
{
	private InterstitialAd mInterstitialAd;
	private int loadRequestAttemp = 0;
	private WebView webView;
	private CallbackManager callbackManager;

	@Override
	protected void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);

		IDChecker idChecker = new IDChecker(this);

		getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);

		setContentView(R.layout.activity_main);

		webView = findViewById(R.id.webview);
		webView.getSettings().setJavaScriptEnabled(true);
		webView.getSettings().setMediaPlaybackRequiresUserGesture(false);
		webView.setOverScrollMode(2);
		webView.getSettings().setUseWideViewPort(true);
		webView.loadUrl("file:///android_asset/game.html");
		webView.addJavascriptInterface(new AndroidBridge(this), "AndroidBridge");

		CookieManager.setAcceptFileSchemeCookies(true);

		webView.setWebViewClient(new MyWebViewClient()
		{
			@Override
			public void onPageFinished(WebView view, String url)
			{
				super.onPageFinished(webView, url);
				webView.loadUrl("javascript:setUUID('" + idChecker.getID() + "')");
			}
		});

		MobileAds.initialize(this, initializationStatus -> webView.loadUrl("javascript:setAdMobReady(true)"));

		loadInterstitialAd();

		callbackManager = CallbackManager.Factory.create();
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data)
	{
		callbackManager.onActivityResult(requestCode, resultCode, data);
		super.onActivityResult(requestCode, resultCode, data);
	}

	private void loadInterstitialAd()
	{
		AdRequest adRequest = new AdRequest.Builder().build();
		InterstitialAd.load(this, "ca-app-pub-3940256099942544/1033173712", adRequest, new InterstitialAdLoadCallback()
		{
			@Override
			public void onAdLoaded(@NonNull InterstitialAd interstitialAd)
			{
				// The mInterstitialAd reference will be null until
				// an ad is loaded.
				mInterstitialAd = interstitialAd;
				loadRequestAttemp = 0;

				mInterstitialAd.setFullScreenContentCallback(new FullScreenContentCallback()
				{
					@Override
					public void onAdClicked()
					{
						// Called when a click is recorded for an ad.
					}

					@Override
					public void onAdDismissedFullScreenContent()
					{
						// Called when ad is dismissed.
						// Set the ad reference to null, so you don't show the ad a second time.
						mInterstitialAd = null;
						webView.loadUrl("javascript:onAdFinish()");
						loadInterstitialAd();
					}

					@Override
					public void onAdFailedToShowFullScreenContent(AdError adError)
					{
						mInterstitialAd = null;
						webView.loadUrl("javascript:onAdFinish()");
					}

					@Override
					public void onAdImpression()
					{
						// Called when an impression is recorded for an ad.
					}

					@Override
					public void onAdShowedFullScreenContent()
					{
						// Called when ad is shown.
					}
				});

				webView.loadUrl("javascript:setInterstitialAdReady(true)");
			}

			@Override
			public void onAdFailedToLoad(@NonNull LoadAdError loadAdError)
			{
				if(loadRequestAttemp++ < 5)
				{
					loadInterstitialAd();
					return;
				}
				// Handle the error
				mInterstitialAd = null;
				webView.loadUrl("javascript:setNoAdCanBeLoad(true)");
			}
		});
	}

	public void showInterstitialAd()
	{
		if(mInterstitialAd != null)
		{
			mInterstitialAd.show(this);
		}
		else
		{
			webView.loadUrl("javascript:onAdFinish()");
		}
	}

	@Override
	public boolean onTouchEvent(MotionEvent event)
	{
		if(event.getAction() == MotionEvent.ACTION_UP)
		{
			event.setAction(MotionEvent.ACTION_CANCEL);
			super.onTouchEvent(event);
			event.setAction(MotionEvent.ACTION_DOWN);
			super.onTouchEvent(event);
			event.setAction(MotionEvent.ACTION_UP);
		}

		return super.onTouchEvent(event);
	}

	@Override
	public void onWindowFocusChanged(boolean hasFocus)
	{
		super.onWindowFocusChanged(hasFocus);

		if(hasFocus)
		{
			View decorView = getWindow().getDecorView();
			decorView.setSystemUiVisibility(
					View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
							| View.SYSTEM_UI_FLAG_HIDE_NAVIGATION | View.SYSTEM_UI_FLAG_FULLSCREEN | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY);
		}
	}

	public WebView getWebView()
	{
		return webView;
	}

	class MyWebViewClient extends WebViewClient
	{
		@Override
		public boolean shouldOverrideUrlLoading(WebView view, String url)
		{
			view.loadUrl(url);
			return true;
		}
	}
}