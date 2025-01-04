import { GLTFLoader} from "./libs/GLTFLoader.js";
const THREE = window.MINDAR.IMAGE.THREE;
import {loadGLTF, loadAudio} from "./libs/loader.js";

document.addEventListener('DOMContentLoaded', () => {
	// Add permanent text overlay
	const overlay = document.createElement('div');
	overlay.style.position = 'fixed';
	overlay.style.bottom = '20px';
	overlay.style.right = '20px';
	overlay.style.backgroundColor = 'rgba(160, 37, 104, 0.9)'; // Using the magenta theme color
	overlay.style.color = 'white';
	overlay.style.padding = '10px 20px';
	overlay.style.borderRadius = '10px';
	overlay.style.fontFamily = 'Montserrat, sans-serif';
	overlay.style.fontSize = '14px';
	overlay.style.zIndex = '1000';
	overlay.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
	overlay.style.backdropFilter = 'blur(5px)';
	overlay.style.border = '1px solid rgba(255,255,255,0.1)';
	overlay.style.lineHeight = '1.5';
	overlay.style.maxWidth = '300px';
	overlay.style.textAlign = 'right';
	overlay.innerHTML = `
		If you need this type of smart visiting card<br>
		contact: <a href="mailto:contactrohitmenon@gmail.com" style="color: #FF9CC7; text-decoration: none;">contactrohitmenon@gmail.com</a>
	`;
	document.body.appendChild(overlay);

	const start = async() => {
		const mindarThree = new window.MINDAR.IMAGE.MindARThree({
			container: document.body,
			imageTargetSrc: './targets.mind',
			maxTrack: 1,  // Changed to 1 since we only need one marker
		});
		
		const {renderer, scene, camera} = mindarThree;
		
		const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
		scene.add(light);
		
		// Create texture loader for loading images
		const textureLoader = new THREE.TextureLoader();
		
		// Create top title plane with modern design
		const topGeometry = new THREE.PlaneGeometry(1.0, 0.35);
		const topCanvas = document.createElement('canvas');
		topCanvas.width = 768;
		topCanvas.height = 256;
		const topContext = topCanvas.getContext('2d');
		
		// Create transparent background with enhanced blur effect
		topContext.fillStyle = 'rgba(255, 255, 255, 0.02)';
		topContext.fillRect(0, 0, topCanvas.width, topCanvas.height);
		
		// Add enhanced glass effect with stronger blur
		const glassGradient = topContext.createLinearGradient(0, 0, 0, topCanvas.height);
		glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
		glassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
		glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.08)');
		topContext.fillStyle = glassGradient;
		topContext.fillRect(0, 0, topCanvas.width, topCanvas.height);
		
		// Add more pronounced noise texture for enhanced blur effect
		for(let i = 0; i < 200; i++) {
			topContext.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.03})`;
			topContext.fillRect(
				Math.random() * topCanvas.width,
				Math.random() * topCanvas.height,
				2,
				2
			);
		}
		
		// Add additional blur layer
		const blurGradient = topContext.createRadialGradient(
			topCanvas.width/2, topCanvas.height/2, 0,
			topCanvas.width/2, topCanvas.height/2, topCanvas.width/2
		);
		blurGradient.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
		blurGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
		topContext.fillStyle = blurGradient;
		topContext.fillRect(0, 0, topCanvas.width, topCanvas.height);
		
		// Add rounded corners with larger radius
		topContext.globalCompositeOperation = 'destination-in';
		topContext.beginPath();
		topContext.roundRect(0, 0, topCanvas.width, topCanvas.height, 40);
		topContext.fill();
		topContext.globalCompositeOperation = 'source-over';
		
		// Add main title with enhanced shadow
		topContext.shadowColor = 'rgba(0, 0, 0, 0.4)';
		topContext.shadowBlur = 25;
		topContext.shadowOffsetY = 8;
		topContext.fillStyle = 'white';
		topContext.textAlign = 'center';
		
		// Draw "LANDMARK" text with ultra-modern font stack
		topContext.font = 'bold 110px "Neue Haas Grotesk Display Pro", "Roobert", "Space Grotesk", sans-serif';
		topContext.letterSpacing = '8px';
		// Add slight gradient to text
		const textGradient = topContext.createLinearGradient(0, 80, 0, 160);
		textGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
		textGradient.addColorStop(1, 'rgba(255, 255, 255, 0.95)');
		topContext.fillStyle = textGradient;
		topContext.fillText('LANDMARK', topCanvas.width/2, 110);
		
		// Add location subtitle
		topContext.font = 'bold 32px "Cabinet Grotesk", "Roobert", sans-serif';
		topContext.letterSpacing = '4px';
		topContext.fillStyle = 'rgba(255, 255, 255, 0.95)';
		topContext.fillText('CHENNAI', topCanvas.width/2, 150);
		
		// Add tagline
		topContext.shadowBlur = 15;
		topContext.shadowOffsetY = 4;
		topContext.font = '500 24px "Cabinet Grotesk", "Roobert", sans-serif';
		topContext.letterSpacing = '6px';
		topContext.fillStyle = 'rgba(255, 255, 255, 0.9)';
		topContext.fillText('BUILDING DREAMS', topCanvas.width/2, 190);
		
		// Add subtle accent lines with gradient
		topContext.shadowColor = 'transparent';
		const lineGradient = topContext.createLinearGradient(
			topCanvas.width/2 - 220, 0,
			topCanvas.width/2 + 220, 0
		);
		lineGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
		lineGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
		lineGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
		
		// Top accent
		topContext.strokeStyle = lineGradient;
		topContext.beginPath();
		topContext.moveTo(topCanvas.width/2 - 220, 65);
		topContext.lineTo(topCanvas.width/2 + 220, 65);
		topContext.lineWidth = 1;
		topContext.stroke();
		
		// Bottom accent
		topContext.beginPath();
		topContext.moveTo(topCanvas.width/2 - 180, 195);
		topContext.lineTo(topCanvas.width/2 + 180, 195);
		topContext.lineWidth = 0.5;
		topContext.stroke();
		
		const topTexture = new THREE.CanvasTexture(topCanvas);
		const topMaterial = new THREE.MeshBasicMaterial({
			map: topTexture,
			transparent: true,
			opacity: 0.75
		});
		const topPlane = new THREE.Mesh(topGeometry, topMaterial);
		topPlane.position.set(0, 0.5, 0);  // Moved lower (from 0.7 to 0.5)
		
		// Create video preview with YouTube branding
		const videoCanvas = document.createElement('canvas');
		videoCanvas.width = 512;
		videoCanvas.height = 512 * (9/16);
		const videoContext = videoCanvas.getContext('2d');
		
		// Create video planes with glass effect background
		const videoWidth = 0.9;
		const videoHeight = videoWidth * (9/16);
		const videoGeometry = new THREE.PlaneGeometry(videoWidth, videoHeight);
		
		// Create background canvas for glass effect
		const videoBackCanvas = document.createElement('canvas');
		videoBackCanvas.width = 512;
		videoBackCanvas.height = 512;
		const videoBackContext = videoBackCanvas.getContext('2d');
		
		// Add glass effect to video background
		const videoGlassGradient = videoBackContext.createLinearGradient(0, 0, 0, videoBackCanvas.height);
		videoGlassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
		videoGlassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
		videoBackContext.fillStyle = videoGlassGradient;
		videoBackContext.fillRect(0, 0, videoBackCanvas.width, videoBackCanvas.height);
		
		// Add rounded corners to video background
		videoBackContext.globalCompositeOperation = 'destination-in';
		videoBackContext.beginPath();
		videoBackContext.roundRect(0, 0, videoBackCanvas.width, videoBackCanvas.height, 30);
		videoBackContext.fill();
		videoBackContext.globalCompositeOperation = 'source-over';
		
		// Create textures and materials
		const videoBackTexture = new THREE.CanvasTexture(videoBackCanvas);
		const videoBackMaterial = new THREE.MeshBasicMaterial({
			map: videoBackTexture,
			transparent: true,
			opacity: 0.6  // More transparent background
		});
		
		const videoTexture = new THREE.CanvasTexture(videoCanvas);
		const videoMaterial = new THREE.MeshBasicMaterial({
			map: videoTexture,
			transparent: true,
			opacity: 0.8  // More transparent foreground
		});
		
		// Create and load YouTube logo
		const ytLogo = new Image();
		ytLogo.crossOrigin = "anonymous";
		ytLogo.src = './images/youtube.png';  // Use your local YouTube logo
		
		ytLogo.onload = () => {
			// Clear canvas
			videoContext.clearRect(0, 0, videoCanvas.width, videoCanvas.height);
			
			// Draw background with enhanced transparency
			videoContext.fillStyle = 'rgba(0, 0, 0, 0.15)';  // More transparent
			videoContext.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
			
			// Add glass effect with more transparency
			const glassGradient = videoContext.createLinearGradient(0, 0, 0, videoCanvas.height);
			glassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)');
			glassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.03)');
			videoContext.fillStyle = glassGradient;
			videoContext.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
			
			// Calculate logo size (35% of canvas width - reduced from 50%)
			const logoSize = videoCanvas.width * 0.35;
			const x = (videoCanvas.width - logoSize) / 2;
			const y = (videoCanvas.height - logoSize) / 2;
			
			// Draw YouTube logo with shadow
			videoContext.shadowColor = 'rgba(0, 0, 0, 0.3)';
			videoContext.shadowBlur = 20;
			videoContext.shadowOffsetY = 5;
			videoContext.drawImage(ytLogo, x, y, logoSize, logoSize);
			
			// Add play text with enhanced styling
			videoContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
			videoContext.shadowBlur = 10;
			videoContext.shadowOffsetY = 2;
			videoContext.font = 'bold 28px "Space Grotesk", sans-serif';
			videoContext.fillStyle = 'rgba(255, 255, 255, 0.9)';
			videoContext.textAlign = 'center';
			videoContext.fillText('Click to Play', videoCanvas.width/2, y + logoSize + 40);
			
			videoTexture.needsUpdate = true;
		};
		
		ytLogo.onerror = () => {
			// Fallback with more transparent styling
			videoContext.fillStyle = 'rgba(0, 0, 0, 0.15)';
			videoContext.fillRect(0, 0, videoCanvas.width, videoCanvas.height);
			videoContext.font = 'bold 28px "Space Grotesk", sans-serif';
			videoContext.fillStyle = 'rgba(255, 255, 255, 0.9)';
			videoContext.textAlign = 'center';
			videoContext.fillText('Click to Play Video', videoCanvas.width/2, videoCanvas.height/2);
			videoTexture.needsUpdate = true;
		};
		
		// Create video planes
		const videoBackPlane = new THREE.Mesh(videoGeometry, videoBackMaterial);
		const videoPlane = new THREE.Mesh(videoGeometry, videoMaterial);
		
		// Position video planes
		videoBackPlane.position.set(1.1, 0, -0.01);
		videoPlane.position.set(1.1, 0, 0);
		
		// Create About Us plane with modern design
		const aboutUsGeometry = new THREE.PlaneGeometry(0.8, 0.7);
		const aboutUsCanvas = document.createElement('canvas');
		aboutUsCanvas.width = 700;
		aboutUsCanvas.height = 768;
		const aboutUsContext = aboutUsCanvas.getContext('2d');
		
		// Create transparent background with blur effect for About Us
		aboutUsContext.fillStyle = 'rgba(255, 255, 255, 0.1)';
		aboutUsContext.fillRect(0, 0, aboutUsCanvas.width, aboutUsCanvas.height);
		
		// Add glass effect
		const aboutGlassGradient = aboutUsContext.createLinearGradient(0, 0, 0, aboutUsCanvas.height);
		aboutGlassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
		aboutGlassGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.15)');
		aboutGlassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
		aboutUsContext.fillStyle = aboutGlassGradient;
		aboutUsContext.fillRect(0, 0, aboutUsCanvas.width, aboutUsCanvas.height);
		
		// Add rounded corners
		aboutUsContext.globalCompositeOperation = 'destination-in';
		aboutUsContext.beginPath();
		aboutUsContext.roundRect(0, 0, aboutUsCanvas.width, aboutUsCanvas.height, 30);
		aboutUsContext.fill();
		aboutUsContext.globalCompositeOperation = 'source-over';
		
		// Add subtle pattern
		aboutUsContext.fillStyle = 'rgba(255, 255, 255, 0.05)';
		for(let i = 0; i < 10; i++) {
			aboutUsContext.fillRect(0, i * 80, aboutUsCanvas.width, 1);
		}
		
		// Modern title with enhanced shadow
		aboutUsContext.shadowColor = 'rgba(0, 0, 0, 0.4)';
		aboutUsContext.shadowBlur = 20;
		aboutUsContext.shadowOffsetY = 6;
		aboutUsContext.fillStyle = 'white';
		aboutUsContext.textAlign = 'left';
		
		// Title text with modern font
		aboutUsContext.font = 'bold 80px "Clash Display", "Space Grotesk", sans-serif';
		aboutUsContext.letterSpacing = '4px';
		aboutUsContext.fillText('ABOUT', 60, 110);
		aboutUsContext.font = '300 46px "Cabinet Grotesk", "Space Grotesk", sans-serif';
		aboutUsContext.fillText('US', 60, 160);
		
		// Add modern description with adjusted font sizes and positions
		const descriptions = [
			{ text: 'CRAFTING EXCELLENCE', size: 48, weight: '600', y: 280 },
			{ text: 'IN CONSTRUCTION', size: 48, weight: '600', y: 330 },
			{ text: 'FOR OVER TWO', size: 44, weight: '500', y: 380 },
			{ text: 'DECADES', size: 44, weight: '500', y: 430 },
			{ text: 'Premium Quality &', size: 40, weight: '400', y: 490 },
			{ text: 'Timeless Design', size: 42, weight: '600', y: 540 }
		];
		
		descriptions.forEach(desc => {
			aboutUsContext.font = `${desc.weight} ${desc.size}px "Space Grotesk", sans-serif`;
			aboutUsContext.letterSpacing = '2px';
			aboutUsContext.fillText(desc.text, 60, desc.y);
		});
		
		// Add accent elements
		aboutUsContext.strokeStyle = 'rgba(255, 255, 255, 0.3)';
		aboutUsContext.beginPath();
		aboutUsContext.moveTo(60, 190);
		aboutUsContext.lineTo(300, 190);
		aboutUsContext.lineWidth = 1;
		aboutUsContext.stroke();
		
		const aboutUsTexture = new THREE.CanvasTexture(aboutUsCanvas);
		const aboutUsMaterial = new THREE.MeshBasicMaterial({
			map: aboutUsTexture,
			transparent: true,
			opacity: 0.9
		});
		const aboutUsPlane = new THREE.Mesh(aboutUsGeometry, aboutUsMaterial);
		
		// Create bottom section with glass effect
		const bottomGeometry = new THREE.PlaneGeometry(1.0, 0.2);
		const bottomCanvas = document.createElement('canvas');
		bottomCanvas.width = 512;
		bottomCanvas.height = 128;
		const bottomContext = bottomCanvas.getContext('2d');
		
		// Add glass effect to bottom section
		const bottomGlassGradient = bottomContext.createLinearGradient(0, 0, 0, bottomCanvas.height);
		bottomGlassGradient.addColorStop(0, 'rgba(255, 255, 255, 0.15)');
		bottomGlassGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
		bottomContext.fillStyle = bottomGlassGradient;
		bottomContext.fillRect(0, 0, bottomCanvas.width, bottomCanvas.height);
		
		// Add rounded corners to bottom section
		bottomContext.globalCompositeOperation = 'destination-in';
		bottomContext.beginPath();
		bottomContext.roundRect(0, 0, bottomCanvas.width, bottomCanvas.height, 20);
		bottomContext.fill();
		
		const bottomTexture = new THREE.CanvasTexture(bottomCanvas);
		const bottomMaterial = new THREE.MeshBasicMaterial({
			map: bottomTexture,
			transparent: true,
			opacity: 0.9
		});
		const bottomPlane = new THREE.Mesh(bottomGeometry, bottomMaterial);
		bottomPlane.position.set(0, -0.6, -0.1);
		
		// Load icon textures
		const phoneIconTexture = textureLoader.load('./images/phone.png');
		const emailIconTexture = textureLoader.load('./images/email.png');
		const webIconTexture = textureLoader.load('./images/web.png');
		const arrowTexture = textureLoader.load('./images/arrow.png');
		
		// Create materials for icons
		const phoneMaterial = new THREE.MeshBasicMaterial({map: phoneIconTexture, transparent: true});
		const emailMaterial = new THREE.MeshBasicMaterial({map: emailIconTexture, transparent: true});
		const webMaterial = new THREE.MeshBasicMaterial({map: webIconTexture, transparent: true});
		const arrowMaterial = new THREE.MeshBasicMaterial({map: arrowTexture, transparent: true});
		
		// Create icon planes
		const iconGeometry = new THREE.PlaneGeometry(0.2, 0.2);
		const phoneIcon = new THREE.Mesh(iconGeometry, phoneMaterial);
		const emailIcon = new THREE.Mesh(iconGeometry, emailMaterial);
		const webIcon = new THREE.Mesh(iconGeometry, webMaterial);
		
		// Create arrow
		const arrowGeometry = new THREE.PlaneGeometry(0.25, 0.25);
		const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
		
		// Initialize positions
		phoneIcon.position.set(-0.25, -0.5, 0);
		emailIcon.position.set(0, -0.5, 0);
		webIcon.position.set(0.25, -0.5, 0);
		arrow.position.set(0, -0.2, 0);
		bottomPlane.position.set(0, -0.6, -0.1);
		
		// Make elements interactive
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		
		// Function to create vCard
		const createVCard = () => {
			const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Landmark Chennai
ORG:Landmark Construction Chennai
TEL;TYPE=work,voice:+919444555345
EMAIL;TYPE=work:landmarkchennai1@gmail.com
URL:https://landmarkchennai.com
END:VCARD`;
			return new Blob([vcard], { type: 'text/vcard' });
		};
		
		// Handle interactions
		const handleInteraction = (event) => {
			event.preventDefault();
			
			const x = event.clientX || (event.touches && event.touches[0].clientX);
			const y = event.clientY || (event.touches && event.touches[0].clientY);
			
			if (x === undefined || y === undefined) return;
			
			mouse.x = (x / window.innerWidth) * 2 - 1;
			mouse.y = -(y / window.innerHeight) * 2 + 1;
			
			raycaster.setFromCamera(mouse, camera);
			
			// Check video interaction
			const videoIntersects = raycaster.intersectObject(videoPlane);
			if (videoIntersects.length > 0) {
				if (youtubeIframe.style.display === 'none') {
					youtubeIframe.style.display = 'block';
					closeButton.style.display = 'block';
					// Start video with autoplay
					youtubeIframe.src = 'https://www.youtube.com/embed/2WLd1zCVX9g?enablejsapi=1&autoplay=1&playsinline=1&controls=1';
				} else {
					youtubeIframe.style.display = 'none';
					closeButton.style.display = 'none';
					// Stop video completely
					youtubeIframe.src = 'about:blank';
					setTimeout(() => {
						youtubeIframe.src = 'https://www.youtube.com/embed/2WLd1zCVX9g?enablejsapi=1&autoplay=0&mute=1&playsinline=1&controls=1';
					}, 100);
				}
				return;
			}
			
			// Check icon interactions
			const iconIntersects = raycaster.intersectObjects([phoneIcon, emailIcon, webIcon]);
			if (iconIntersects.length > 0) {
				const clickedIcon = iconIntersects[0].object;
				if (clickedIcon === phoneIcon) {
					const vCardBlob = createVCard();
					const vCardURL = URL.createObjectURL(vCardBlob);
					
					const downloadLink = document.createElement('a');
					downloadLink.href = vCardURL;
					downloadLink.download = 'landmark_chennai_contact.vcf';
					document.body.appendChild(downloadLink);
					downloadLink.click();
					document.body.removeChild(downloadLink);
					URL.revokeObjectURL(vCardURL);
					
					setTimeout(() => {
						window.location.href = 'tel:+919444555345';
					}, 100);
				} else if (clickedIcon === emailIcon) {
					window.location.href = 'mailto:landmarkchennai1@gmail.com';
				} else if (clickedIcon === webIcon) {
					window.open('https://landmarkchennai.com', '_blank');
				}
			}
		};
		
		// Add event listeners
		document.addEventListener('click', handleInteraction);
		document.addEventListener('touchstart', handleInteraction);
		
		const anchor = mindarThree.addAnchor(0);
		anchor.group.add(topPlane);      // Add top plane
		anchor.group.add(aboutUsPlane);
		anchor.group.add(videoBackPlane);
		anchor.group.add(videoPlane);
		anchor.group.add(phoneIcon);
		anchor.group.add(emailIcon);
		anchor.group.add(webIcon);       // Add web icon back
		anchor.group.add(arrow);         // Add arrow back
		anchor.group.add(bottomPlane);
		
		// Animation variables
		let startTime = Date.now();
		const animationDuration = 1500; // Increased duration for smoother animations
		let isFirstDetection = true;
		
		// Animation function with enhanced effects
		const animate = () => {
			const currentTime = Date.now();
			const elapsed = currentTime - startTime;
			const progress = Math.min(1, elapsed / animationDuration);
			
			// Custom easing functions
			const easeOutBack = (t) => {
				const c1 = 1.70158;
				const c3 = c1 + 1;
				return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
			};
			
			const easeOutElastic = (t) => {
				const c4 = (2 * Math.PI) / 3;
				return t === 0 ? 0 : t === 1 ? 1 :
					Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
			};
			
			// Animate top title with bounce effect
			if (progress < 0.3) {
				const titleProgress = Math.min(1, progress / 0.3);
				topPlane.position.y = 0.5 + (1 - easeOutBack(titleProgress)) * 1.5;
				topPlane.scale.set(
					1 + (1 - easeOutElastic(titleProgress)) * 0.3,
					1 + (1 - easeOutElastic(titleProgress)) * 0.3,
					1
				);
			} else {
				topPlane.position.y = 0.5 + Math.sin(currentTime * 0.002) * 0.02;
			}
			
			// Animate About Us section
			if (progress > 0.2) {
				const aboutProgress = Math.min(1, (progress - 0.2) / 0.8);
				aboutUsPlane.position.x = -0.8 + (0.2 * easeOutBack(aboutProgress));
				aboutUsPlane.position.y = Math.sin(currentTime * 0.002) * 0.01;
				aboutUsPlane.material.opacity = aboutProgress;
				aboutUsPlane.rotation.z = Math.sin(currentTime * 0.001) * 0.01;
			}
			
			// Animate video with adjusted position
			if (progress > 0.4) {
				const videoProgress = Math.min(1, (progress - 0.4) / 0.6);
				videoPlane.position.x = 1.1 - (0.2 * easeOutBack(videoProgress));  // Updated X position
				videoPlane.position.y = 0;  // Keep Y position constant
				videoPlane.scale.set(
					1 + Math.sin(currentTime * 0.002) * 0.02,
					1 + Math.sin(currentTime * 0.002) * 0.02,
					1
				);
				videoMaterial.opacity = videoProgress;
			}
			
			// Animate bottom icons with stagger
			if (progress > 0.6) {
				const iconProgress = Math.min(1, (progress - 0.6) / 0.4);
				const iconScale = 1 + Math.sin(currentTime * 0.004) * 0.1;
				
				// Phone icon
				phoneIcon.scale.set(iconScale, iconScale, 1);
				phoneIcon.rotation.z = Math.sin(currentTime * 0.002) * 0.1;
				
				// Email icon with delay
				const emailDelay = Math.min(1, (progress - 0.7) / 0.3);
				emailIcon.scale.set(iconScale * emailDelay, iconScale * emailDelay, 1);
				emailIcon.rotation.z = Math.sin((currentTime + 500) * 0.002) * 0.1;
				
				// Web icon with delay
				const webDelay = Math.min(1, (progress - 0.8) / 0.2);
				webIcon.scale.set(iconScale * webDelay, iconScale * webDelay, 1);
				webIcon.rotation.z = Math.sin((currentTime + 1000) * 0.002) * 0.1;
			}
			
			// Animate arrow with pulse effect
			if (progress > 0.9) {
				const arrowScale = 1 + Math.sin(currentTime * 0.006) * 0.15;
				arrow.scale.set(arrowScale, arrowScale, 1);
				arrow.position.y = -0.2 + Math.sin(currentTime * 0.003) * 0.1;
				arrow.rotation.z = Math.sin(currentTime * 0.002) * 0.15;
			}
		};
		
		// Target detection handlers with enhanced reset
		anchor.onTargetFound = () => {
			startTime = Date.now();
			
			// Reset all transformations
			topPlane.scale.set(1, 1, 1);
			aboutUsPlane.material.opacity = 0;
			videoMaterial.opacity = 0;
			phoneIcon.scale.set(0, 0, 1);
			emailIcon.scale.set(0, 0, 1);
			webIcon.scale.set(0, 0, 1);
			arrow.scale.set(0, 0, 1);
		};
		
		anchor.onTargetLost = () => {
			aboutUsPlane.position.set(-0.8, 0, 0);
			videoPlane.position.set(1.1, 0, 0);
			videoMaterial.opacity = 0;
			youtubeIframe.style.display = 'none';  // Hide YouTube iframe
			
			// Reset all animations
			topPlane.position.y = 0.5;
			topPlane.scale.set(1, 1, 1);
			aboutUsPlane.rotation.z = 0;
			phoneIcon.scale.set(1, 1, 1);
			emailIcon.scale.set(1, 1, 1);
			webIcon.scale.set(1, 1, 1);
			arrow.scale.set(1, 1, 1);
		};
		
		// Create YouTube iframe with enhanced options
		const youtubeIframe = document.createElement('iframe');
		youtubeIframe.width = '100%';  // Changed to be more responsive
		youtubeIframe.height = '100%';  // Changed to be more responsive
		youtubeIframe.src = 'https://www.youtube.com/embed/-2CnCrz38F4?enablejsapi=1&autoplay=0&mute=0&playsinline=1&controls=1&rel=0';
		youtubeIframe.frameBorder = '0';
		youtubeIframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen';
		youtubeIframe.allowFullscreen = true;
		youtubeIframe.style.display = 'none';
		youtubeIframe.style.position = 'fixed';
		youtubeIframe.style.top = '50%';
		youtubeIframe.style.left = '50%';
		youtubeIframe.style.transform = 'translate(-50%, -50%)';
		youtubeIframe.style.zIndex = '1000';
		youtubeIframe.style.width = '90vw';     // Changed to viewport width
		youtubeIframe.style.height = '50.625vw'; // 16:9 aspect ratio (90 * 9/16)
		youtubeIframe.style.maxHeight = '80vh';  // Maximum height relative to viewport
		youtubeIframe.style.backgroundColor = 'black';
		youtubeIframe.style.borderRadius = '12px';
		youtubeIframe.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
		document.body.appendChild(youtubeIframe);
		
		// Add close button for video
		const closeButton = document.createElement('button');
		closeButton.innerHTML = '×';
		closeButton.style.position = 'fixed';
		closeButton.style.display = 'none';
		closeButton.style.top = '10%';
		closeButton.style.right = '10%';
		closeButton.style.zIndex = '1001';
		closeButton.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
		closeButton.style.color = 'white';
		closeButton.style.border = 'none';
		closeButton.style.borderRadius = '50%';
		closeButton.style.width = '40px';
		closeButton.style.height = '40px';
		closeButton.style.fontSize = '24px';
		closeButton.style.cursor = 'pointer';
		closeButton.style.transition = 'all 0.3s ease';
		closeButton.onclick = () => {
			youtubeIframe.style.display = 'none';
			closeButton.style.display = 'none';
			// Stop video completely by loading a blank page
			youtubeIframe.src = 'about:blank';
			// After a brief moment, reset the video source for next play
			setTimeout(() => {
				youtubeIframe.src = 'https://www.youtube.com/embed/-2CnCrz38F4?enablejsapi=1&autoplay=0&mute=1&playsinline=1&controls=1';
			}, 100);
		};
		document.body.appendChild(closeButton);
		
		await mindarThree.start();		
		
		// Animation loop
		renderer.setAnimationLoop(() => {
			animate();
			
			// Update the video texture
			videoTexture.needsUpdate = true;
			
			renderer.render(scene, camera);
		});
	}
	start();
});
