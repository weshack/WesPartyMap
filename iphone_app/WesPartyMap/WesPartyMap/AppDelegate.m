//
//  AppDelegate.m
//  WesPartyMap
//
//  Created by Sam on 9/6/13.
//  Copyright (c) 2013 weshack. All rights reserved.
//

#import "AppDelegate.h"

@implementation AppDelegate
{
CLLocationManager *locationManager;
CLLocationManager *bglocationManager;
    NSTimer *timer;
    NSString *user;


}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
    NSBundle *bundle = [NSBundle mainBundle];
    NSString *file = [bundle pathForResource:@"user" ofType:@"txt"];
    NSString *string = [NSString stringWithContentsOfFile:file encoding:NSUTF8StringEncoding error:nil];
    NSLog(string);
    if ([string length] > 0){
        NSArray *data = [string componentsSeparatedByCharactersInSet:
                          [NSCharacterSet characterSetWithCharactersInString:@","]
                          ];
        user = [data objectAtIndex:1];
        
        [self startStandardUpdates];
    }
    // Override point for customization after application launch.
    return YES;
}
							
- (void)applicationWillResignActive:(UIApplication *)application
{
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later. 
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
    [self->locationManager stopUpdatingLocation];
    
    UIApplication*    app = [UIApplication sharedApplication];
    
    _bgTask = [app beginBackgroundTaskWithExpirationHandler:^{
        [app endBackgroundTask:_bgTask];
        _bgTask = UIBackgroundTaskInvalid;
    }];
    
    self->timer = [NSTimer scheduledTimerWithTimeInterval:30
                                                  target:self->locationManager
                                                selector:@selector(startUpdatingLocation)
                                                userInfo:nil
                                                 repeats:YES];
}

- (void)applicationWillEnterForeground:(UIApplication *)application
{
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application
{
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
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
        NSString *sendURL = [NSString stringWithFormat:@"http://3iny.localtunnel.com/checkin/%@/%f/%f", user, location.coordinate.latitude, location.coordinate.longitude];
        NSURL *url = [NSURL URLWithString: sendURL];
        NSURLRequest *request = [NSURLRequest requestWithURL:url];
        NSURLConnection *conn = [[NSURLConnection alloc] initWithRequest:request delegate:self];
        NSLog(@"%@", url);
//        NSLog(@"latitude %+.6f, longitude %+.6f\n",
//              location.coordinate.latitude,
//              location.coordinate.longitude);
    }
}

@end
