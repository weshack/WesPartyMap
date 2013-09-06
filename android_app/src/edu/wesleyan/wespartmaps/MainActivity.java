package edu.wesleyan.wespartmaps;

import java.io.File;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class MainActivity extends Activity {
	
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        File file = getFileStreamPath("userid.info");
        if (!file.exists()){
        	Log.e("File:", "not found");
        	RegisterUser reg = new RegisterUser(this);
        	reg.execute();
        } else {
        	Intent mServiceIntent = new Intent(this, LocationCollector.class);
        	startService(mServiceIntent);
        }
    }   
}
