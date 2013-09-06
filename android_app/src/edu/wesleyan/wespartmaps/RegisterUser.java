package edu.wesleyan.wespartmaps;

import java.io.ByteArrayOutputStream;
import java.io.FileOutputStream;
import java.io.IOException;

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
import android.os.AsyncTask;
import android.util.Log;
import android.widget.TextView;

class RegisterUser extends AsyncTask<Void, String, String> {
	Activity mActivity;
	
	RegisterUser(Activity a){
		Log.i("RegisterUser", "Instantiated");
		mActivity = a;
	}
	
	@Override
    protected String doInBackground(Void... args) {
        	HttpClient httpclient = new DefaultHttpClient();
            HttpResponse response;
            String responseString = null;
            try {
                response = httpclient.execute(new HttpGet("http://wespartymap.com/user/add/default/0/0"));
                StatusLine statusLine = response.getStatusLine();
                if(statusLine.getStatusCode() == HttpStatus.SC_OK){
                    ByteArrayOutputStream out = new ByteArrayOutputStream();
                    response.getEntity().writeTo(out);
                    out.close();
                    responseString = out.toString();
                    Log.i("Response String:", responseString);
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
		TextView textView = (TextView)mActivity.findViewById(R.id.text);
    	textView.setText(R.string.main);
		Intent mServiceIntent = new Intent(mActivity, LocationCollector.class);
    	mActivity.startService(mServiceIntent);
	}
}