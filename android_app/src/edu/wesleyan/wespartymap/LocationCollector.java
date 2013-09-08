package edu.wesleyan.wespartymap;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStreamReader;
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

public class LocationCollector extends IntentService implements
		LocationListener {

	double mLatitude;
	double mLongitude;

	public LocationCollector() {
		super("LocationCollector");
	}

	@Override
	protected void onHandleIntent(Intent workIntent) {
		LocationManager locationManager = (LocationManager) this
				.getSystemService(Context.LOCATION_SERVICE);
		locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER,
				60 * 30, 0, this);
		Location lastKnown = locationManager
				.getLastKnownLocation(LocationManager.GPS_PROVIDER);
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
		} catch (FileNotFoundException e) {
			// oops
		} catch (IOException e) {
			// oops
		}

		HttpClient httpclient = new DefaultHttpClient();
		try {
			httpclient.execute(new HttpPost("http://wespartymap.com/checkin/"
					+ id + "/" + mLatitude + "/" + mLongitude));
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
			} catch (FileNotFoundException e) {
				// oops
			} catch (IOException e) {
				// oops
			}

			HttpClient httpclient = new DefaultHttpClient();
			try {
				httpclient.execute(new HttpPost(
						"http://wespartymap.com/checkin/" + id + "/"
								+ mLatitude + "/" + mLongitude));
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
