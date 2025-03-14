![cs2-2024](https://github.com/user-attachments/assets/afbeb13e-1f2f-4a98-a77a-fb0f42a3ecf7)
# <p align="center">Pro CS2 DMA</p>

<p align="center">「Pro CS2 DMA」 is a passion project, and I will do my best to optimize the user experience. I hope everyone can offer good suggestions for improvement. The project itself is in C++, with the radar based on JavaScript and HTML. Suggestions can be related to technical skills or even natural language logic. Everyone is smart, and maybe your inspiration can bring significant improvements to the project.</p>

## ✨Features 
|     Feature  |   Preview   |
|  :---:       |   :---:     |
| Aimbot🔫    | ![aim](https://github.com/user-attachments/assets/6ae23d1b-df50-48f3-964f-60830b2745c8)  |
| Visuals👀   | ![esp](https://github.com/user-attachments/assets/d9127f6a-cd54-4c63-af0d-090c5e026cf2)  |
| Misc⚙       | ![misc](https://github.com/user-attachments/assets/ed60409f-c3f7-4fd2-b030-8f1efd88e948) |
| Other       | Decrypt platform encryption、Visible check via VPK parsing  |
 
## 🧩 Screenshots
> Esp feature demonstration.
> 
> ![esp](https://github.com/user-attachments/assets/76f2fe8f-c0d5-4852-97cd-a5b98f7bd548)

> 
> Visible check and dynamic FOV feature demonstration.
> ![IMG_0098 mov_20240820_010313_compressed](https://github.com/user-attachments/assets/54c6202b-45c7-40da-a8a5-36d68993c030)
> 



                              

 

# <p align="center">Web Radar🧭</p>
<p align="center">Easy to read, infinitely resizeable.</p>
<p align="center">Two styles: static and centered, rotating with the view.</p>

![radar_2024 11 03-18 41](https://github.com/user-attachments/assets/30b4b6c6-2239-435d-bd4c-f6f26f656e8a)


## 🗺Radar Features
|     Dots    |   Type   |     Description     |
|  :---:       |   :---:  |         :---:       |
| ![player](https://github.com/user-attachments/assets/b41a9cdc-6461-47e9-a2c8-860e13e1f260) | Default     | Both CT and T players are shown, along with the weapon they're holding and their nickname.    |
|  ![host_dot](https://github.com/user-attachments/assets/98a2df8b-3722-49b0-b36d-c5a38267a245)| Host       | The selected main view player is easy to distinguish.      |
| ![low hp](https://github.com/user-attachments/assets/101e1743-abca-4cf3-a6c8-f2dbe81ca284) | Health indicator  | When a player loses health, the color of the health ring will change accordingly.      |
| ![boom player](https://github.com/user-attachments/assets/44848735-f3ee-4c59-9d8e-a6476ef302e7)| Bomb carrier  | Shows the player that has the C4 with them. Easily spottable on the radar because of the color difference. |
| ![dead](https://github.com/user-attachments/assets/16de6160-cb20-4273-b4ef-7e255db29bff)| Dead  | Killed players are still faintly visible on the radar as a small cross.      |
| ![f1 (1)](https://github.com/user-attachments/assets/e6e2fcf2-d29a-4c14-bbb6-da1b9a845ce0)| Firing state  | Player firing state.      |
| ![Hurt (1)](https://github.com/user-attachments/assets/8207e985-e6f9-49ff-ac47-776c3e7abf0d)| Hurt  | When the player takes damage.     |
| ![shan (1)](https://github.com/user-attachments/assets/7a4edc95-f4bf-4323-8833-485db1b82173)| Blinded | The state when a player is blinded by a flashbang.     |
| ![smoke (1)](https://github.com/user-attachments/assets/e0287184-10de-47f0-8cf9-9e3ed3697d86)| Smoke | Smoke grenade by CT and T teams.     |
| ![huo (1)](https://github.com/user-attachments/assets/354542b5-0c90-46f2-8f46-ae2b1a0905dd)| Incendiary  | Incendiary grenade.     |
| ![zhayan](https://github.com/user-attachments/assets/09937762-0e49-46f2-ac1e-bd0bf7fd0547)| Explosion  | Smoke grenade exploded by a grenade.     |

### Follow the action  

When only a few players are alive most of the radar is just empty and only a very small part contains all the action. The autozoom feature has resolved this issue. The radar image can automatically pan and zoom according to where the players are located, and smoothly follows the action.
  **<p align="center">![697](https://github.com/user-attachments/assets/28a271a4-d1ce-4516-ac13-740db8efcab0)</p>** 
Autozoom tries to keep the action in the middle, with a safe padding around any players so they can never accidentally run off the radar image. it also has a minimal zoom level, so that the radar only zooms in when the action is concentrated in a small part of the map.  

  


### Advisories

  Advisories are automatically detected events that the observer might want to switch to. To make switching to this event easier, the observer slot number is displayed next to an icon noting the type of advisory. The observer should still make his own judgment of the situation.  

|     Advisory    |   Type   |     Description     |
|  :---:       |   :---:  |         :---:       |
| ![no](https://github.com/user-attachments/assets/285a2d04-5001-4a59-ac1f-b954e4c15fc1)| Default     | This is displayed when no other notable events are happening.    |
| ![plant](https://github.com/user-attachments/assets/af6671fc-581c-4858-af52-b39487e2d625)| Planted bomb  | Countdown after bomb is planted.      |  
| ![chai](https://github.com/user-attachments/assets/8b698bfc-623b-4d75-b6a9-5334384db852)| Defusing      | A CT is defusing the bomb.      |



### And much more
  + Smokes, molotovs and flashbangs shown on the map
  + Split maps for upper and lower on Nuke and Vertigo 
  + Player dot z-height indicators, either by color dot or scale
  + Any radar background color, including full transparency
  + Player selection, choose the main view
  + Hide teammates



# How to use ❓

  1. Download the latest [release](../../releases).
  2. Run `radar.exe` (if use this feature).
  3. Run `Pro CS2.exe`
  4. Enjoy the game😀


# Planned tasks 📑  

  - [x] ✅Fix the slight delay in ESP display (It seems like only I have this issue? My friend doesn't. Do you guys have it?)
  - [x] ✅Optimize aimbot movement trajectory to make it more human-like
  - [x] ✅Customize multiple bone selections for aimbot (currently: rifle: head, neck; pistol: head; sniper rifle: head, neck, upper torso, lower torso)
  - [ ] Add a dead zone to aimbot
  - [x] ✅Fix the performance of sniper rifles under the Magnet triggerbot function
  - [x] ✅Improve web radar functionality
  - [x] ✅Add item flight trajectory to web radar
  - [x] ✅Address issues related to C4, as traversing C4 consumes too much performance. It's currently disabled and will be improved once a solution is found
  - [x] ✅Optimize memory reading performance
  - [x] ✅Revise kmbox-related code

    

    

> [!IMPORTANT]
> There are still some features that need improvement, and I will update them as soon as possible. Once the code is organized, I will upload the source code. In the meantime, I will first release the packaged program. 

If you have any suggestions regarding the project and its features, you can use the Issues section to let me know. 

If the project has been helpful to you, please give it a ⭐star⭐.




