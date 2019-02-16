# Drive Less
### *[Video Demo](https://drive.google.com/open?id=14KKw43fZn2rYURZgpifnEibeqVCP45OE)*

Drive Less was envisioned as an app that would assist its users in planning their weekly schedule around traffic. Similar tools do exist, but awareness of those tools is limited due to improvable market placement. So, using traffic prediction as a means to see at a glance how much time you schedule has you on the road was the baseline desire.

Unfortunately, at the time of making this, I was unable to gain access to resources that provided accurate traffic data (currently uses google which provides an estimate of time for point to point travel, discluding traffic though this may have just been an error at that time).


## Use

Drive Less uses Expo to easily access your phone's calendar information and upon loading begins querying Google's servers for any events with addresses already entered. Events are displayed filtering out any events that have already finished and displaying the remainder of the week.

Any event can be pressed to bring up an overview of the most pertinent event details. To add use to the app, users can edit any value here within the app. At this summary screen, once a user enters a destination, the app will begin to form a list of tentative departure times ranging in increments of (currently) 15 minutes, populating a list that the user can choose from to ideally spend less time on the road.

## Future Plans

This app does not function without a resource that offers accurate traffic prediction so I'd like to eventually gain access to Waze's SDK (owned by Google).
Further, while this is merely a demo, showing the potential usefulness of being able to manage your schedule with traffic predictions, future iterations should incorporate multiple data points: traffic, weather, and etc.
Drive Less is currently highly manual and I'd like this to change. Ideally, while manual adjustments would--of course--still be possible, the app should be able to recommend schedule adjustments and even offer that events could be replaced with services that remove the need to drive to that event entirely (for example, if you needed dog food but could only find your desired brand at one very inconvenient location, assuming your grocery list is in your event's notes, it should be able to reach in and offer alternatives)

## Technologies
* React Native -- a facebook managed framework for creating native iOS and Android apps while writing in JavaScript, JSX, Xcode, and etc.
* Expo -- a complementary tool to React Native that expands upon React Native's mission statement of further allowing a coder to specialize in Javascript while providing a myriad of helpful tools that would otherwise require a good deal of setup.
* Nativebase.io -- a styling framework that takes advantage of React Native's highly modularized nature to enhance and quicken the programmer's ability to create smooth, attractive interfaces
* Google Places API -- a resource provided by Google that allows for searches by establishment (this was used in the GoogleAddressAutocomplete component)
* [React Native Google Places Autocomplete](https://github.com/FaridSafi/react-native-google-places-autocomplete) -- a tool provided by FaridSafi that provides instant to instant updates to user input to speed the entry of destinations.
* Google Distance Matrix API -- a resouce provided by Google that enables routing for multiple destinations