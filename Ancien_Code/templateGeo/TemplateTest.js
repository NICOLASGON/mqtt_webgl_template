
    var scene, camera, renderer, mesh;
    var meshFloor, ambientLight, light;
    var crate, crateTexture, crateNormalMap, crateBumpMap;
    var tabObject = new Array();
    var keyboard = {};
    var container;
    var hauteurFenetre = window.innerHeight;
    var largeurFenetre = window.innerWidth;
    var player = { height: 1.4, speed: 0.5, turnSpeed: Math.PI*0.02 };
    var USE_WIREFRAME = false;


    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, (largeurFenetre-500)/(hauteurFenetre), 1, 1000);

    createSphere(1,'#FFFFFF',0,1,0,true,true);
    createCube(1,'#FFFFFF',3,3,3,true,true);
    createFloor(50,50,'#FFFFFF',true);
    createAmbientLight('#404040',0.5);
    createPointLight('#FFFFFF',1,18,1,-2,6,-2, true);
    setCameraPos(1,player.height,-5,0,player.height,0);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(largeurFenetre-500,hauteurFenetre);
    container = $('#container');
    container.append(renderer.domElement);

    animate();
    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);

    /* Crée un point lumineux */
    function setCameraPos(x,y,z,vecteurX,vecteurY,vecteurZ){
      camera.position.set(x, y, z);
      camera.lookAt(new THREE.Vector3(vecteurX,vecteurY,vecteurZ));
    }

    /* Crée un point lumineux */
    function createPointLight(color, intensity, distance, decay, x, y, z, castOmbre){
      light = new THREE.PointLight(color, intensity, distance, decay);
      light.position.set(x,y,z);
      light.castShadow = castOmbre;
      scene.add(light);
    }

    /* Crée une lumiere ambiante */
    function createAmbientLight(color,intensity){
      ambientLight = new THREE.AmbientLight(color,intensity);
      scene.add(ambientLight);
    }

    /* Crée un sol */
    function createFloor(x,y,color,ombreReceive){
      meshFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(x,y, 10,10),
        new THREE.MeshPhongMaterial({color:color, wireframe:USE_WIREFRAME})
      );
      meshFloor.rotation.x -= Math.PI / 2;
      meshFloor.receiveShadow = ombreReceive;
      scene.add(meshFloor);


    }
    function inverserWireframe(){
      for(i=0;i<tabObject.length;i++){
         tabObject[i].material.wireframe=!tabObject[i].material.wireframe;
      }

    }
    /* animation + touches */
    function animate(){

      requestAnimationFrame(animate);

      for(i=0;i<tabObject.length;i++){
         tabObject[i].rotation.x += 0.01;
         tabObject[i].rotation.y += 0.02;

      }

      if(keyboard[90]){ // Z -> avant
        camera.position.x -= Math.sin(camera.rotation.y) * player.speed;
        camera.position.z -= -Math.cos(camera.rotation.y) * player.speed;
      }
      if(keyboard[83]){ // S -> arriere
        camera.position.x += Math.sin(camera.rotation.y) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y) * player.speed;
      }
      if(keyboard[81]){ // Q -> gauche
        camera.position.x += Math.sin(camera.rotation.y + Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI/2) * player.speed;
      }
      if(keyboard[68]){ // D -> droite
        camera.position.x += Math.sin(camera.rotation.y - Math.PI/2) * player.speed;
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI/2) * player.speed;
      }

      if(keyboard[37]){ // left arrow key
        camera.rotation.y -= player.turnSpeed;
      }
      if(keyboard[39]){ // right arrow key
        camera.rotation.y += player.turnSpeed;
      }

      renderer.render(scene, camera);
    }

    /* Créé un cube */
    function createCube(size,colors,posX, posY, posZ, ombreCast, ombreReceive){
      mesh = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, size),
        new THREE.MeshPhongMaterial({ color: colors })
      );
      mesh.position.set(posX, posY, posZ);
      mesh.receiveShadow = ombreReceive;
      mesh.castShadow = ombreCast;
      tabObject.push(mesh);
      scene.add(mesh);
    }

    /* Créé une sphere */
    function createSphere(size,colors,posX, posY, posZ, ombreCast, ombreReceive){
      mesh = new THREE.Mesh(
        new THREE.SphereGeometry(size, 50, 20),
        new THREE.MeshPhongMaterial({ color: colors })
      );
      mesh.position.set(posX, posY, posZ);
      mesh.receiveShadow = ombreReceive;
      mesh.castShadow = ombreCast;
      tabObject.push(mesh);
      scene.add(mesh);
    }

    /* fonction appuie touche */
    function keyDown(event){
      keyboard[event.keyCode] = true;
    }

    /* fonction releve touche */
    function keyUp(event){
      keyboard[event.keyCode] = false;
    }


    //MQTT
        client = new Paho.MQTT.Client("91.224.148.106", Number(2533),"samrecois");
        client.onConnectionLost = function (responseObject){
          console.log("Connection perdue: "+responseObject.errorMessage);
        }

        function onConnect(){
          console.log("Connecte");
          client.subscribe("sampublie");
        }

        client.connect({onSuccess: onConnect});

        client.onMessageArrived = function (message) {
        console.log("Message arrive: " + message.payloadString);
        console.log("Topic:     " + message.destinationName);
        var msg=message.payloadString;

        var tab=msg.split(",");
        if(tab[0]=="c"){
          tabObject[0].material.color.set(tab[1]);
        }else if(tab[0]=="p"){
          tabObject[0].position.set(tab[1],tab[2],tab[3])
        }else if(tab[0]=='cree'){
      createCube(1,'#FF0000',5,5,5,true,true);
        }
        //console.log("QoS:       " + message.qos);
        //console.log("Retained:  " + message.retained);
        //console.log("Duplicate: " + message.duplicate);
        }
