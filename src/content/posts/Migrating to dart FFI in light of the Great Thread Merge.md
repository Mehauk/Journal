---
date: 2025-12-29
tags: [dart, flutter, kotlin, ffi, jni, android]
excerpt: Refactoring my application to use FFI instead of platform channels
readTime: 8 min read
---

### Preamble
One of my Flutter applications relied heavily on platform channels to call native android APIs. A slight nusance I found working with platform channels, was that they were always asynchronous, even when the underlying android API was not. In my case, all of the native calls could have been synchronous.

Inititally, having misubderstood the update, I assumed that updating to the latest Flutter version (which at the time of this artical was 3.38) and updating my method channel signatures to sync was going to be all that I needed to do. 

I was wrong. Instead, platform channels are still asynchronous. The thread merge was an update for those using Foreign Function Interfaces (FFI). What this meant for me, was that to take advantage of the update, I would have to refactor my code to use FFI instead of platform channels.

### The Rundown
For this refactor I would first create FFI bindings for the APIs I wanted to use in the Dart layer.

Next I would update any repositories that relied on my platform service to instead rely on a FFI service, making sure to update any function signatures to synchronous.

Finally I would refactor all of the references to the the affected functions. My app was built using Bloc for state management, which meant I had to remove any loading states/events from the applications.

### Generating the FFI bindings
My native layer was written in kotlin so I added the package `jni` (which Im assuming stands for Java Native Interface) and generated the bindings using `jnigen` which i added as a dev dependency. I prefer configurations as code, so I used a dart file to setup the generation rather than yaml.

```dart
// ./tool/jnigen.dart
import 'dart:io';

import 'package:jnigen/jnigen.dart';

void main(List<String> args) {
  final packageRoot = Platform.script.resolve('../');
  generateJniBindings(
    Config(
      outputConfig: OutputConfig(
        dartConfig: DartCodeOutputConfig(
          path: packageRoot.resolve(
            'lib/data/services/jni_bindings_service.dart',
          ),
          structure: OutputStructure.singleFile,
        ),
      ),
      androidSdkConfig: AndroidSdkConfig(addGradleDeps: true),
      sourcePath: [packageRoot.resolve('android/app/src/main/kotlin')],
      classes: [
        'com.example.solar_alarm.services.Alarm',
      ],
    ),
  );
}
```

To actually generate the bindings, however, jnigen requires a compiled apk to hook into. So I ran `flutter build apk` before running `dart ./tool/jnigen.dart`.

### Dart Refactoring
First I updated my repositories, which was simple since I was already using dependency injection. I just swapped out the `platform_service` for the respective `ffi_service`.

I then changed the function definitions to by synchronous. which caused my IDE to flaire up with errors.

Finally, to resolve the errors, I refactored the relevant portions of my bloc code.