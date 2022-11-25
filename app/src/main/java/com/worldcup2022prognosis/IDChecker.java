package com.worldcup2022prognosis;

import android.content.SharedPreferences;

import java.util.UUID;

import static android.content.Context.MODE_PRIVATE;

public class IDChecker
{
	private final SharedPreferences sharedPreferences;
	private String uuid;
	private final String UUID_KEY = "uuid";

	public IDChecker(MainActivity mainActivity)
	{
		sharedPreferences = mainActivity.getPreferences(MODE_PRIVATE);
		loadUUID();
	}

	public void loadUUID()
	{
		uuid = getUUID();

		if(uuid == null)
		{
			uuid = generateUUID();
		}
	}

	private String getUUID()
	{
		return sharedPreferences.getString(UUID_KEY, null);
	}

	private String generateUUID()
	{
		String uuid_ = UUID.randomUUID().toString();
		SharedPreferences.Editor editor = sharedPreferences.edit();
		editor.putString(UUID_KEY, uuid_);
		editor.commit();

		return uuid_;
	}

	public String getID()
	{
		return uuid;
	}
}
