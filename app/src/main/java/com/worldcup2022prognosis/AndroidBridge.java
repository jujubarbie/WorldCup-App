package com.worldcup2022prognosis;

import android.webkit.JavascriptInterface;

public class AndroidBridge
{
	MainActivity mainActivity;

	/**
	 * Instantiate the interface and set the context
	 */
	AndroidBridge(MainActivity mainActivity)
	{
		this.mainActivity = mainActivity;
	}

	@JavascriptInterface
	public void myMethod(String test)
	{
		mainActivity.getWebView().post(() -> mainActivity.getWebView().loadUrl("javascript:displayWhatever('" + test + "')"));
	}

	@JavascriptInterface
	public void showAd()
	{
		try
		{
			mainActivity.getWebView().post(() -> mainActivity.showInterstitialAd());

		}
		catch(Exception e)
		{
			mainActivity.getWebView().post(() -> mainActivity.getWebView().loadUrl("javascript:displayWhatever('" + e.getMessage() + "')"));
		}
	}
}
