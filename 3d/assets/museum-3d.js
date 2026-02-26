// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);
scene.fog = new THREE.Fog(0x1a1a1a, 100, 500);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1.6, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(20, 30, 20);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.far = 100;
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.top = 50;
directionalLight.shadow.camera.bottom = -50;
scene.add(directionalLight);

// Museum room
const roomWidth = 40;
const roomDepth = 60;
const roomHeight = 15;

// Floor
const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
const floorMaterial = new THREE.MeshStandardMaterial({
    color: 0x2a2a2a,
    roughness: 0.8,
    metalness: 0.1
});
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Ceiling
const ceilingGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
const ceilingMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.9
});
const ceiling = new THREE.Mesh(ceilingGeometry, ceilingMaterial);
ceiling.position.y = roomHeight;
ceiling.rotation.x = Math.PI / 2;
ceiling.receiveShadow = true;
scene.add(ceiling);

// Back wall
const backWallGeometry = new THREE.PlaneGeometry(roomWidth, roomHeight);
const wallMaterial = new THREE.MeshStandardMaterial({
    color: 0x3a3a3a,
    roughness: 0.7
});
const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
backWall.position.z = -roomDepth / 2;
backWall.position.y = roomHeight / 2;
backWall.receiveShadow = true;
scene.add(backWall);

// Front wall
const frontWall = new THREE.Mesh(backWallGeometry, wallMaterial);
frontWall.position.z = roomDepth / 2;
frontWall.position.y = roomHeight / 2;
frontWall.receiveShadow = true;
scene.add(frontWall);

// Left wall
const leftWallGeometry = new THREE.PlaneGeometry(roomDepth, roomHeight);
const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -roomWidth / 2;
leftWall.position.y = roomHeight / 2;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Right wall
const rightWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
rightWall.rotation.y = Math.PI / 2;
rightWall.position.x = roomWidth / 2;
rightWall.position.y = roomHeight / 2;
rightWall.receiveShadow = true;
scene.add(rightWall);

// Create canvas texture for paintings
function createPaintingTexture(title, color1, color2) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 512, 512);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Decorative elements
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, 432, 432);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, 60, 392, 392);

    // Title text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(title, 256, 256);

    ctx.font = '20px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.fillText('Painting', 256, 300);

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearFilter;
    return texture;
}

// Add paintings to walls
const paintings = [
    { x: -12, z: -roomDepth / 2 + 0.1, title: 'Abstract I', color1: '#ff6b6b', color2: '#ff8e8e' },
    { x: 0, z: -roomDepth / 2 + 0.1, title: 'Abstract II', color1: '#4ecdc4', color2: '#44af9a' },
    { x: 12, z: -roomDepth / 2 + 0.1, title: 'Abstract III', color1: '#ffe66d', color2: '#ffd700' },
    { x: -roomWidth / 2 + 0.1, z: -15, title: 'Serenity', color1: '#95e1d3', color2: '#f38181', rotY: true },
    { x: roomWidth / 2 - 0.1, z: 0, title: 'Dreams', color1: '#a8edea', color2: '#fed6e3', rotY: true },
];

const paintingObjects = [];

paintings.forEach(paintingData => {
    const paintingGeometry = new THREE.PlaneGeometry(8, 6);
    const paintingMaterial = new THREE.MeshStandardMaterial({
        map: createPaintingTexture(paintingData.title, paintingData.color1, paintingData.color2),
        roughness: 0.4,
        metalness: 0
    });
    const painting = new THREE.Mesh(paintingGeometry, paintingMaterial);
    painting.position.set(paintingData.x, 7, paintingData.z);
    painting.castShadow = true;
    painting.receiveShadow = true;

    if (paintingData.rotY) {
        painting.rotation.y = Math.PI / 2;
    }

    painting.title = paintingData.title;
    painting.description = `A stunning piece of modern abstract art`;

    scene.add(painting);
    paintingObjects.push(painting);
});

// FPS Camera Controls
const keys = {};
const moveSpeed = 0.15;
const mouseSensitivity = 0.003;
let pitch = 0;
let yaw = 0;
let isLocked = false;

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.exitPointerLock?.();
        isLocked = false;
        return;
    }
    
    const key = e.key.toLowerCase();
    if (isLocked && ['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault();
    }
    keys[key] = true;
    keys[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
    keys[e.code] = false;
});

document.addEventListener('click', () => {
    if (document.pointerLockElement === document.documentElement) {
        isLocked = true;
    } else {
        document.documentElement.requestPointerLock?.();
    }
});

document.addEventListener('pointerlockchange', () => {
    isLocked = document.pointerLockElement === document.documentElement;
});

document.addEventListener('mousemove', (e) => {
    if (!isLocked) return;

    yaw -= e.movementX * mouseSensitivity;
    pitch -= e.movementY * mouseSensitivity;
    pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, pitch));
});

// Raycaster for painting detection
const raycaster = new THREE.Raycaster();
const centerPoint = new THREE.Vector2(0, 0);

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update camera rotation first
    camera.rotation.order = 'YXZ';
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    // Camera movement - use camera's actual direction
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    
    // Forward vector (keep horizontal for ground-based movement)
    const forward = new THREE.Vector3(direction.x, 0, direction.z).normalize();
    const right = new THREE.Vector3(-direction.z, 0, direction.x).normalize();

    let movement = new THREE.Vector3();
    if (keys['w'] || keys['KeyW'] || keys['ArrowUp']) movement.add(forward);
    if (keys['s'] || keys['KeyS'] || keys['ArrowDown']) movement.sub(forward);
    if (keys['a'] || keys['KeyA'] || keys['ArrowLeft']) movement.sub(right);
    if (keys['d'] || keys['KeyD'] || keys['ArrowRight']) movement.add(right);

    if (movement.lengthSq() > 0) {
        movement.normalize().multiplyScalar(moveSpeed);
        camera.position.add(movement);
    }

    // Keep camera above floor
    camera.position.y = Math.max(1.6, camera.position.y);
    camera.position.y = Math.min(roomHeight - 0.5, camera.position.y);
    camera.position.x = Math.max(-roomWidth / 2 + 0.5, Math.min(roomWidth / 2 - 0.5, camera.position.x));
    camera.position.z = Math.max(-roomDepth / 2 + 0.5, Math.min(roomDepth / 2 - 0.5, camera.position.z));

    // Update UI
    document.getElementById('pos').textContent = 
        `${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)}`;

    // Check which painting we're looking at
    raycaster.setFromCamera(centerPoint, camera);
    const intersects = raycaster.intersectObjects(paintingObjects);
    const paintingInfo = document.getElementById('paintingInfo');

    if (intersects.length > 0 && intersects[0].distance < 50) {
        const painting = intersects[0].object;
        paintingInfo.innerHTML = `<strong>${painting.title}</strong><br>${painting.description}`;
        paintingInfo.classList.add('visible');
    } else {
        paintingInfo.classList.remove('visible');
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
