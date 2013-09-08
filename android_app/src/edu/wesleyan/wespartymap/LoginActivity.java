package edu.wesleyan.wespartymap;

import java.io.File;

import edu.wesleyan.wespartymap.R;
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

public class LoginActivity extends Activity {
	
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        File file = getFileStreamPath("userid.info");
        if (!file.exists()){
        	Button button = (Button)findViewById(R.id.button1);
        	final Activity a = this;
        	button.setOnClickListener(new View.OnClickListener() {
                public void onClick(View v) {
                	EditText et = (EditText)findViewById(R.id.address);
                	RegisterUser reg = new RegisterUser(a);
                	reg.execute(et.getText().toString());
                }
            });
        } else {
        	Intent mServiceIntent = new Intent(this, MainActivity.class);
        	startActivity(mServiceIntent);
        }
    }   
}
