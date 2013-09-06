package edu.wesleyan.wespartmaps;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;

public class LocationCollector extends IntentService implements
		LocationListener {

	double mLatitude;
	double mLongitude;

	public LocationCollector() {
		super("LocationCollector");
	}

	@Override
	protected void onHandleIntent(Intent workIntent) {
		Log.e("test", "test2");
		LocationManager locationManager = (LocationManager) this
				.getSystemService(Context.LOCATION_SERVICE);
		Log.i("Main Activity", "Location Manager: " + locationManager);
		locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,
				60 * 30, 0, this);
		Location lastKnown = locationManager
				.getLastKnownLocation(LocationManager.GPS_PROVIDER);
		Log.i("Main Activity", "Last Known: " + lastKnown);
		if (lastKnown != null) {
			mLatitude = lastKnown.getLatitude();
			mLongitude = lastKnown.getLongitude();
		} else {
			mLatitude = mLongitude = 0;
		}

		String id = "NULL";
		try {
			FileInputStream fIn = this.openFileInput("userid.info");
			InputStreamReader in = new InputStreamReader(fIn);
			BufferedReader reader = new BufferedReader(in);
			id = reader.readLine();
			Log.e("The uid is:", id);
		} catch (FileNotFoundException e) {
			// oops
		} catch (IOException e) {
			// oops
		}

		HttpClient httpclient = new DefaultHttpClient();
		try {
			HttpResponse response = httpclient.execute(new HttpPost(
					"http://54j9.localtunnel.com/checkin/" + id + "/"
							+ mLatitude + "/" + mLongitude));
			StatusLine statusLine = response.getStatusLine();
			if (statusLine.getStatusCode() == HttpStatus.SC_OK) {
				Log.i("WesPartyMaps-Location: ",
						"Updated the latitude and longitude to (" + mLatitude
								+ "," + mLongitude + ")");
			} else {
				Log.e("WesPartyMaps-Location: ",
						"We received an error contacting the server! "
								+ statusLine.getStatusCode());
			}
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	@Override
	public void onLocationChanged(Location location) {
		if (location != null) {
			mLatitude = location.getLatitude();
			mLongitude = location.getLongitude();
			String id = "NULL";
			try {
				FileInputStream fIn = this.openFileInput("userid.info");
				InputStreamReader in = new InputStreamReader(fIn);
				BufferedReader reader = new BufferedReader(in);
				id = reader.readLine();
				Log.e("The uid is:", id);
			} catch (FileNotFoundException e) {
				// oops
			} catch (IOException e) {
				// oops
			}

			try {
				FileInputStream fIn = this.openFileInput("userid.info");
				InputStreamReader in = new InputStreamReader(fIn);
				BufferedReader reader = new BufferedReader(in);
				id = reader.readLine();
				Log.e("The uid is:", id);
			} catch (FileNotFoundException e) {
				// oops
			} catch (IOException e) {
				// oops
			}

			HttpClient httpclient = new DefaultHttpClient();
			try {
				HttpResponse response = httpclient.execute(new HttpPost(
						"http://54j9.localtunnel.com/checkin/" + id + "/"
								+ mLatitude + "/" + mLongitude));
				StatusLine statusLine = response.getStatusLine();
				if (statusLine.getStatusCode() == HttpStatus.SC_OK) {
					Log.i("WesPartyMaps-Location: ",
							"Updated the latitude and longitude to ("
									+ mLatitude + "," + mLongitude + ")");
				} else {
					Log.e("WesPartyMaps-Location: ",
							"We received an error contacting the server! "
									+ statusLine.getStatusCode());
				}
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	@Override
	public void onProviderDisabled(String provider) {
	}

	@Override
	public void onProviderEnabled(String provider) {
	}

	@Override
	public void onStatusChanged(String provider, int status, Bundle extras) {
	}

}
