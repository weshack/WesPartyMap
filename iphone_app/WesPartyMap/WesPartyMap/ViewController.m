//
//  ViewController.m
//  WesPartyMap
//
//  Created by Sam on 9/6/13.
//  Copyright (c) 2013 weshack. All rights reserved.
//

#import "ViewController.h"
#import <CoreLocation/CoreLocation.h>
@interface ViewController ()

@end

@implementation ViewController
{
    IBOutlet UILabel *serviceStartLabel;
    IBOutlet UITextField *addressBox;
    IBOutlet UIButton *submitbox;
    NSMutableData *responseData;
    NSString *addressCollected;
    NSString *identifier;
    NSString *coords;
//    NSNumber *lat;
//    NSNumber *longt;
    CLLocationManager *locationManager;
    CLLocationManager *bglocationManager;
    NSTimer *timer;
    NSString *user;

    }
@synthesize address;
- (IBAction)addUser:(id)sender {
    
    
    NSString *streetAddress = (address.text);
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *file = [documentsDirectory stringByAppendingPathComponent:@"user"];
    addressCollected = [NSString stringWithFormat:@"%@, Middletown CT", streetAddress];
    [self addNewUser];
    NSString *writeString = [NSString stringWithFormat:@"%@,%@", addressCollected, identifier];
    NSLog(writeString);
    [writeString writeToFile:file atomically:YES encoding:NSUTF8StringEncoding error:nil];
    NSString *string = [NSString stringWithContentsOfFile:file encoding:NSUTF8StringEncoding error:nil];
    NSLog(string);
    [serviceStartLabel setHidden:false];
    [addressBox setHidden:true];
    [submitbox setHidden:true];
    [self.view endEditing:YES];
    [self startStandardUpdates];
}
- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view, typically from a nib.
    
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    NSString *documentsDirectory = [paths objectAtIndex:0];
    NSString *file = [documentsDirectory stringByAppendingPathComponent:@"user"];
    NSString *string = [NSString stringWithContentsOfFile:file encoding:NSUTF8StringEncoding error:nil];
    NSLog(string);
    if ([string length] > 0){
        NSArray *data = [string componentsSeparatedByCharactersInSet:
                         [NSCharacterSet characterSetWithCharactersInString:@","]
                         ];
        
        user = [data objectAtIndex:1];
        [serviceStartLabel setHidden:false];
        NSLog(address.text);
        [addressBox setHidden:true];
        [submitbox setHidden:true];
        [self startStandardUpdates];
    }
    else{
        
    }
    
//    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
//    NSString *documentsDirectory = [paths objectAtIndex:0];
//    NSString *file = [documentsDirectory stringByAppendingPathComponent:@"user"];
//    NSString *string1 = [NSString stringWithContentsOfFile:file encoding:NSUTF8StringEncoding error:nil];
//    NSLog(string1);
//    if ([string1 length] > 0){
//        
//    }

}
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
- (void)hideServiceStart
{
    [serviceStartLabel setHidden:true];
}
-(void)addNewUser
{
    responseData = [NSMutableData data];
    
    CLGeocoder *geocoder = [[CLGeocoder alloc] init];
    [geocoder geocodeAddressString:addressCollected completionHandler:^(NSArray* placemarks, NSError* error){
        CLPlacemark *aPlacemark = [placemarks objectAtIndex:0];
                                    // Process the placemark.
        NSNumber *lat = [[NSNumber alloc] initWithFloat:aPlacemark.location.coordinate.latitude];
        NSNumber *longt = [[NSNumber alloc] initWithFloat:aPlacemark.location.coordinate.longitude];
        NSLog(@"Got Placemark : %@, %@", lat, longt);
                 
    NSLog(@"coordinates=%@", coords);
    //NSString *sendURL = [NSString stringWithFormat:@"http://3z69.localtunnel.com/userios/add/%@/", addressCollected];
    NSString *sendURL = [NSString stringWithFormat:@"http://wespartymap.com/user/add/default/%@/%@", lat, longt];

    NSURL *url = [NSURL URLWithString: sendURL];
    NSLog(sendURL);
    NSURLResponse *response;
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    NSData *dataReply = [NSURLConnection sendSynchronousRequest:request returningResponse:&response error:nil];
    NSString *stringReply = (NSString *)[[NSString alloc] initWithData:dataReply encoding:NSUTF8StringEncoding];
    NSDictionary *myDictionary  = [NSJSONSerialization JSONObjectWithData:dataReply options:NSJSONReadingMutableLeaves error:nil];
    identifier = [myDictionary objectForKey:@"uid"];
    NSLog(@"%@", identifier);}];
    
}
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    [responseData setLength:0];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    [responseData appendData:data];
    NSLog(@"%@", data);

}
- (void)startStandardUpdates
{
    // Create the location manager if this object does not
    // already have one.
    if (nil == locationManager)
        locationManager = [[CLLocationManager alloc] init];
    
    locationManager.delegate = self;
    locationManager.pausesLocationUpdatesAutomatically = true;
    locationManager.desiredAccuracy = kCLLocationAccuracyBest;
    
    // Set a movement threshold for new events.
    locationManager.distanceFilter = 30;
    [locationManager startUpdatingLocation];
}

- (void)locationManager:(CLLocationManager *)manager
     didUpdateLocations:(NSArray *)locations {
    // If it's a relatively recent event, turn off updates to save power
    CLLocation* location = [locations lastObject];
    NSDate* eventDate = location.timestamp;
    NSTimeInterval howRecent = [eventDate timeIntervalSinceNow];
    if (abs(howRecent) < 15.0) {
        // If the event is recent, do something with it.
        //        NSString *name = @"10";
        NSString *sendURL = [NSString stringWithFormat:@"http://wespartymap.com/checkin/%@/%f/%f", identifier, location.coordinate.latitude, location.coordinate.longitude];
        NSURL *url = [NSURL URLWithString: sendURL];
        NSURLRequest *request = [NSURLRequest requestWithURL:url];
        NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
        NSLog(@"%@", sendURL);
        //        NSLog(@"latitude %+.6f, longitude %+.6f\n",
        //              location.coordinate.latitude,
        //              location.coordinate.longitude);
    }
}


@end
