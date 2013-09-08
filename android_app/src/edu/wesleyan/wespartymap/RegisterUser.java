package edu.wesleyan.wespartymap;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Locale;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.location.Address;
import android.location.Geocoder;
import android.os.AsyncTask;

class RegisterUser extends AsyncTask<String, String, String> {
	Activity mActivity;
	
	RegisterUser(Activity a){
		mActivity = a;
	}
	
	@Override
    protected String doInBackground(String... args) {
			String address = args[0];
			Geocoder geocoder = new Geocoder(mActivity, Locale.getDefault());
			List<Address> addresses = null;
			double lat = 0, longitude = 0;
			try {
				addresses = geocoder.getFromLocationName(address, 1);
				lat = addresses.get(0).getLatitude();
				longitude = addresses.get(0).getLongitude();
			} catch (Exception e) {
				// we will just ignore it and reset lat,longitude
				lat = longitude = 0;
			}
			
			
        	HttpClient httpclient = new DefaultHttpClient();
            HttpResponse response;
            String responseString = null;
            try {
                response = httpclient.execute(new HttpGet("http://wespartymap.com/user/add/default1/"+lat+"/"+longitude));
                StatusLine statusLine = response.getStatusLine();
                if(statusLine.getStatusCode() == HttpStatus.SC_OK){
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    response.getEntity().writeTo(out);
                    out.close();
                    responseString = out.toString();
                    JSONObject jObject = new JSONObject(responseString);
                    String uid = jObject.getString("uid");
                    FileOutputStream outputStream = mActivity.openFileOutput("userid.info", Context.MODE_PRIVATE);
                    outputStream.write(uid.getBytes());
                    outputStream.close();
                } else {
                    //Closes the connection.
                    response.getEntity().getContent().close();
                    throw new IOException(statusLine.getReasonPhrase());
                }
            } catch (ClientProtocolException e) {
                //TODO Handle problems..
            } catch (IOException e) {
                //TODO Handle problems..
            } catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            return responseString;
        }

	@Override
	protected void onPostExecute(String result) {
		super.onPostExecute(result);
		Intent mServiceIntent = new Intent(mActivity, MainActivity.class);
    	mActivity.startActivity(mServiceIntent);
	}
}