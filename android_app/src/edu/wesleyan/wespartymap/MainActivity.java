package edu.wesleyan.wespartymap;

import java.io.File;

import edu.wesleyan.wespartymap.R;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.widget.TextView;

public class MainActivity extends Activity {
	
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        File file = getFileStreamPath("userid.info");
        if (!file.exists()){
        	TextView textView = (TextView)findViewById(R.id.text);
        	textView.setText("Registering your phone with WesPartyMap...");
        	RegisterUser reg = new RegisterUser(this);
        	reg.execute();
        } else {
        	Intent mServiceIntent = new Intent(this, LocationCollector.class);
        	startService(mServiceIntent);
        }
    }   
}
