# Fro (Froc.us OS)

![Status Version](https://img.shields.io/badge/Status-Live-blue.svg)
![Status Version](https://img.shields.io/badge/Type-Web_OS-087f8d)
![Status Version](https://img.shields.io/badge/Previosly_shipped_at-macondo-blue.svg)

*(previously shipped to macondo ysws program)*

Frocus is a productivity system that helps user live a life user always wanted to live. Frocus aims at delivering the most productive ecosystem to the user to stop them from procastinating. Among, the ecosystem;

FRO OS is a WebOS that anyone with Desktop/Laptop/Bigger Device can use and get to use features like Task system, Event management system, Note system, Productive Pomodoro sessions, Motivating Quotes, Weather insights to plan physical schedules (like touching grass, gym, exercise, jogging), Music app for listening to calm and peaceful music while working, Filesystem to organize notes, works, files, musics, code files, Browser for searching anything (and getting AI summary, Images, and Best links) as well as browsing productive sites (like wikipedia, gutenberg, desmos, zenpen, excalidraw, etc), calculator for calculating simple arithmetics to complex trigonometric functions (with keyboard shortcuts & memory), Terminal for fast operations (for devs), Launcher for customizations, Utils for daily-life utilities, Frays as a mean of partner for you when you feel alone, Games for you to enjoy, Theme for vibe, Panels for quick controls, Fai for automating tasks, Scripts (in the form of Fromine file) for autonomous tasks and many more.

## Demo

[DEMO](https://drive.google.com/file/d/1kFF960pYAocFQeoBA-b5GE7_vaI3kfDo/view?usp=sharing)

## Tech Stack

- Tanstack Start
- React (w/ compiler)
- Tailwind CSS
- Zustand (w/ immer)
- React-RND
- Biome
- Shadcn
- Mathjs
- React (Youtube, Markdown, Dropzone)
- Chrono-node, ms, date-fns
- Tavily
- ffmpeg
- Convert
- Openrouter (Adapter)
- Jszip


## Apps 

*(I really encourage reviewer to be #chill and test different features of the webOS since there's honestly a lot and is very hard to jot them down. Ironically, If I jot them down, it would take me more than 2+ hours)*

1. Frotes (Tab system, Task system, Markdown support, Multi-Tab, Storage system)

*(Update):* This change isnot specifically of frotes but very close. I had add the hidden information system in the frotes (which is only applicable for the tasks of the user in tasks widget). You can check this using `{_<<hide>>_}` Any content you wanna add `{_</</hide>>_}`, but it won't hide the information in any files, it only works for `user-task.todo` inside `notes`.

<img width="764" height="514" alt="image" src="https://github.com/user-attachments/assets/e6cfc13d-2753-484e-934a-44c965d90bad" />

2. Frottings (for Wallpaper change)

<img width="767" height="510" alt="image" src="https://github.com/user-attachments/assets/41a3ae59-cc2f-4d2d-881f-bb97b3b12eb3" />

3. Frowser (Search via tavily, and browse via Iframe containerization)

*(Update):* Add the support for my very own `fro://`. You can test this right now, by goind to froxplorer and right click on any file/folder and click on view on frowser. (This isnot the full story now, but sooner or later it has potential to serve pdfs, etc without the need of any application)

<img width="751" height="507" alt="image" src="https://github.com/user-attachments/assets/42a62ee0-0387-499c-b5f7-100a5c2a44bf" />

4. Frominal (with dozens of commands like ls, mkdir, touch, rm, rmdir, read, edit, write, append, cd, open [app], calc, type, fetch, hash, geo, random, note, task.[add | read | done], event.[add | read], append, write, ps, mem, launch [launchables], etc)

*(Update):* File format of `.fromine` in froxplorer can hold text, where each new line resemble new commands that can be automatically executed if that file is ran. This works as an automation. The same frominal can be used to execute different commands by Fai with the help of shadow apps.

Addition of new command includes:

- get.brightness - 	Get the current brightness of the OS. Usage: `get.brightness`
- set.brightness -	Set the brightness in the OS. Usage: `set.brightness <0-100>`
- get.theme -     	Get the current theme in use and all theme options available in the OS. Usage: `get.theme`
- set.theme -     	Set the theme in the OS. Usage: `set.theme <THEME>`
- get.background - 	Get the current background in use and all background options available in the OS. Usage: `get.background`
- set.background -	Set the background in the OS. Usage: `set.background <BACKGROUND> ['center' | 'left' | 'right']`
- launch -        	Launch different launchables from launcher. Usage: `launch [app_not_found | app_fypemaster | app_frodle | app_fentalMaths]`

and, mutation on the filesystem commands (cd, mkdir, touch, rm, rmdir, read, edit, write, append) to support path resolver i.e. composite paths like /notes/physics.frote, and also made some of them have UI feedback to give any response.

<img width="750" height="500" alt="image" src="https://github.com/user-attachments/assets/84241afa-9f4a-4602-bdfb-0c44232d570b" />

5. Froculator (Complex arithmetic & trigonometric calculations with memory system and shorcuts)

<img width="744" height="506" alt="image" src="https://github.com/user-attachments/assets/72aef0ae-569d-426c-8c6f-14f2ffa77bcc" />

6. Frolendar (Event Management System featuring Day, Month, and Year view, with selection time blocking, drag n drop events)

*(Update):* It is now in complete sync with the Events, Task, and Pomodoro widget of OS. i.e. you can link any task to work/break and set its priority. Afterwards, that task can be selected from the pomodoro widget and you can start a block. Once you pause or complete that block, Event is automatically saved to the calendar. So, this makes the system a full-fledge productivity system to keep track of what you did for how long.

<img width="754" height="499" alt="image" src="https://github.com/user-attachments/assets/3a7fd3f3-c4c5-40cf-b1d9-d208490cac84" />

7. Frosic (Create your own playlist and Play youtube & local musics)

*(Update):* Media Panel (viewable by clicking on the Wi-Fi, Volume, and Battery portion in the taskbar) which can be used to control the volume, brightness, and media play/pause, next/previous media.

<img width="754" height="500" alt="image" src="https://github.com/user-attachments/assets/a30c3b34-49ae-45f1-9357-9b986db6c297">

8. Frotore (Add more widget instances)

<img width="755" height="504" alt="image" src="https://github.com/user-attachments/assets/c11542f2-f001-4ae3-8f10-c038fa8e6017" />

9. Froxplorer (Create, Read, Update, Delete, Drag n Drop, Upload, Move, Add to desktop, the files, folders, and open or edit their content)

*(Update:)* Froxplorer has built-in metric of total & selected items, and options to delete, select all or even export the content as zip, and json formats to your Real OS. 

<img width="750" height="501" alt="image" src="https://github.com/user-attachments/assets/36ea4e7f-ec80-4d65-aa2f-0a24ad724b85" />

10. Froncher (Launch any App, or Games (Supports HTML, CSS, JS and even some APIS via file with .html extension in Froxplorer))

*(Update:)* It has now two brand new games. See it in the Launcher section of this markdown file.

<img width="759" height="499" alt="image" src="https://github.com/user-attachments/assets/aafe0c2e-41da-4a3e-94f5-d51df123979b" />

11. Ftils (Contains many daily life utilities like currency converter, units converter)

- Units Converter

    It can basically convert any common units to another common units. It utilises `convert` package and supports multiple convension for the same unit (like; Minute can be written as both minutes or m provided either the `to` or `from` unit has another time unit in the same convension used). (If anything doesnot work, it's not my fault, it's the fault of package).

- Currency Converter

    It utilises `https://api.frankfurter.dev` api to fetch the currency rates and multiplies the amount with the rate obtained from the API. (I believe you should use currency symbols as `npr`, `inr`, `usd`, `aed`, etc)

---


## Launcher (Froncher)

<img width="1520" height="765" alt="image" src="https://github.com/user-attachments/assets/8aed9bd4-478f-4d18-a931-0f73ce92308d" />

---

1. FypeMaster (Type at the speed close to 99.99% of c)
2. Frodle (A cool little game to test your ability to guess) *(new)*

    Frodle is wordle version of Fro OS. Users can choose to use three modes:
    (Full Random): Utilises external js package to generate random word
    (Shortlisted Word): Utilises set of 859 fixed word array to generate a random one
    (Notes): Utilises each and every file written by user to generate a random word from their notes

    User have 5 chances to guess a 5 lettered word (though it's just a minute worth of work for me to change it so that it have `N` chances to guess `M` lettered word). Yellow means Letter is correct but position is wrong. Guess means both Letter and Position are correct.

3. FentalMaths (A hot little game to test your mental maths ability) *(new)*

    FentalMaths is a game running for 60 seconds with 4 different levels to choose from, where the game asks you with Arithmetic mathematical questions and you need to think and answer as fast as you can and score as much score as you can. (I donot have access to camera so I couldnot make the app track you using calculator. Well that's just an excuse cause you can infact use Froculator when playing this game).

    I got inspiration of this game from Matiks.

4. Froview (Witness the pixels)
5. Frowebview (Witness the power of markups)
6. NOTFOUND (Are you f*#king kidding me? I meant Froking)

---

## Froxplorer's Filesystem and App system (Froncher or Other APP) supported extensions

files are ended with .{extension}, default is .frote. Here's the list of all supported extensions.

- "calc": Calculator (Froculator) App associated
- "mp3", "wav", "frosic": Music (Frosic) App associated
- "md", "txt", "frote", "task", "todo": Note (Frote) App associated
- "script", "fromine", "brainfrok": Terminal (Frominal) App associated
- "png", "jpg", "jpeg", "svg": Image viewer (Froview) App associated
- "ftml", "ftm", "htm", "html": Web viewer (Frowebview) App associated
- "frocus", "fro": App Launcher (Froncher) associated
- "frowse": Browser (Frowser) associated

---

## Widgets

<img width="1919" height="869" alt="image" src="https://github.com/user-attachments/assets/2cdd2896-a869-4062-b5ae-45c3846fde90" />

---

1. Weather (Shows the current weather through openweathermap)
2. Clock (Shows the current time)
3. Quote (Shows random quotes through zenquotes)
4. Tasks (Shows the tasks)
5. Pomodoro (Starts pomodoro timer)
6. Events (Shows the upcoming events)

*(Update:)* Tasks, Events and Pomodoro widgets are now synced together. Tasks now has delete and link options for individual todos, and Pomodoro now has custom time adding mechanism (either click on the time, and mutate, or double click on that to unleash prompt to add custom time. Recommended is double click, since click and mutate system has a flaw of input box setting the caret position), and select option to choose the work/break-ing for TASK.

---

*(new additions to the Fro-OS ecosystem)*

## Theme

Themes are cool

1. Default (Old is Silver)

    Glassmorphism ultra pro max

2. Halloween (Let it be spooky)

    I donot know why it looks very similar to orange candy

## Frays 

Frays are the pet/companions for you. Frays that are trying to be your friend from the start are:

1. Frokk (See at the bottom left corner of your screen. Try Hovering it.)

    Hovering makes it tease you. You cannot drag it.

2. Fhost (Don't know where it lives cause its Fhost)

    Hovering makes it stop at that place. You can drag it. The motion of it is completely random (the logic bounds its maximum travellable distance in one go)

## Fai (Fro AI)

Fai is magic that makes Fro-OS to "First WebOS to name its AI as Fai". Fai works seemlessly and can perform almost any task that can be done via the use of frominal (terminal). Trust me you can do so many things with it, like creating a folder and adding individual files with the added content to it.

## Panels

Add Two new panels (technically three but fai panel is the interface for fai so I am neglecting it).

- Media Panel

    Media Panel can be toggled clicking on the Wi-Fi, Speaker, Battery icon container in the taskbar.
    It has FROCUS brand text, brightness and sound adjustment feature and battery and setting icon.

- Miscellaneous Panel (Notification Panel)

    Miscellaneous Panel can be toggled clicking on the time and date section in the taskbar.
    It can be use to view the notifications generated by the application.

## Get started with contribution

Step 1: Clone
```bash
git clone https://github.com/BurningFlamesss/fro-3am
```

Step 2: Install deps
```bash
npm i
```

Step 3: Rename `.env.example` to `.env.local` and change the variables

Step 4: Run either the dev server or the production server
```bash
npm run dev
npm run build
```

Step 5 (Optional): 
1. If you want to add a widget or application:
- Goto src/widgets or src/apps to create own widget or application and then,
- Register that in /src/constants/widgets and /src/constants/widgetsAppDefinition (for widgets) or /src/constants/apps (for application),
2. Else, you can also goto /src/store/launcher to add your Froncher compatible application.


## Inspiration

I donot know the exact time but I was very excited when I created my first ecommerce website before the teacher taught a chapter `ecommerce websites` in computer science. My brother heard about this and he called me to say that `Linus Torvald` made Linux at very young age so try building that.

I got really excited just to realise that building an Operating System from scartch is a very tough thing to pull off by a solo developer. Thus, I completely rejected that advice and continued upgrading myself in terms of Web Knowledge.

After two years, I finally got enough skills, but didnot thought of making anything like WebOS until I got a slack ping from Stardance and I came across a challenge called build your webos. I went through the guide and it felt so basic for me. Then, I thought to complete my dream, and worked almost 72 hours over the past 3 months to build V1 of FRO OS and submitted to Macondo to receive huge funding in form of hardware grant and Meta quest 3 grant.

Then, after a month, I came across 3am and thought of making the FRO OS have multiple themes, AI functionality, Exporting the file/folder functionality, Daily utilities, My own `fro://`, My own games `Frodle` and `FentalMaths`, and ultimate sync between widgets to enable a productive mode in my life that makes FRO OS unique from any ordinary WebOS. I am quite surprise that I worked nearly 37 hours across 1-2 weeks.

At last, I really want to thank you my brother, Stardance, Macondo, and 3am for making me motivated on working in my dream project.

## AI Declarations

- *(Please see AI Declarations at README-from-old-ship-at-macondo.md for any AI usages done on previous ship)*
- `Rendered fewer hooks than expected. This may be caused by an accidental early return statement` due to the fact that I mistakenly spelt the intended useWidgetAppsStore as usewidgetAppsStore which doesnot fit under the react hook and thus getting the issue. Eventually used AI to fix that which took almost 8 minutes (I get this time by the fact that I started opencode when 1 hour was looged today, and stopped when it was done at 1 hour 8 minutes).
- `/src/constants/words.tsx`. I used AI to create a list of words with their frequency and difficulties and copy pasted them in the file so that Frodle can use the random word from there. (Only the words, frequency and difficulty labels are from AI)
- `tried to fix the music not playing automatically` but the fix doesnot work (I donot know the exact time but it should be less than 20 minutes (I get this number from the gap between two commits))