import React, { useState, useEffect, useCallback, useRef } from 'react';
import '../Css/Shop2.css';

const Shop2 = () => {
  // Maze configuration
  const MAZE_WIDTH = 16;
  const MAZE_HEIGHT = 16;
  const SCREEN_WIDTH = 80;
  const SCREEN_HEIGHT = 24;
  const FOV = Math.PI / 3; // 60 degrees
  const MAX_DEPTH = 16;

  // Maze layout (1 = wall, 0 = empty space)
  const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,1,0,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,1,0,0,0,0,1,0,1],
    [1,0,1,0,1,1,1,0,1,1,1,1,0,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,0,1,0,1,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,1,0,1,0,0,0,0,1],
    [1,1,1,0,1,0,1,0,1,0,1,0,1,1,1,1],
    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  // Player state
  const [player, setPlayer] = useState({
    x: 1.5,
    y: 1.5,
    angle: 0,
    moveSpeed: 0.1,
    rotSpeed: 0.1
  });

  // Trophy state
  const [trophy, setTrophy] = useState({
    x: 14.5,
    y: 13.5,
    collected: false,
    animationFrame: 0
  });

  const [screen, setScreen] = useState([]);
  const keysPressed = useRef(new Set());
  const animationRef = useRef(0);

  // Raycasting function
  const castRay = useCallback((rayAngle) => {
    const stepSize = 0.01;
    let distance = 0;
    let hitWall = false;

    const eyeX = Math.cos(rayAngle);
    const eyeY = Math.sin(rayAngle);

    while (!hitWall && distance < MAX_DEPTH) {
      distance += stepSize;
      const testX = Math.floor(player.x + eyeX * distance);
      const testY = Math.floor(player.y + eyeY * distance);

      if (testX < 0 || testX >= MAZE_WIDTH || testY < 0 || testY >= MAZE_HEIGHT) {
        hitWall = true;
        distance = MAX_DEPTH;
      } else if (maze[testY][testX] === 1) {
        hitWall = true;
      }
    }

    return distance;
  }, [player.x, player.y]);

  // Render the 3D view
  const render = useCallback(() => {
    const newScreen = Array(SCREEN_HEIGHT).fill().map(() => Array(SCREEN_WIDTH).fill(' '));

    for (let x = 0; x < SCREEN_WIDTH; x++) {
      const rayAngle = (player.angle - FOV / 2.0) + (x / SCREEN_WIDTH) * FOV;
      const distanceToWall = castRay(rayAngle);

      // Calculate wall height with minimum ceiling space
       const wallHeight = SCREEN_HEIGHT / distanceToWall;
       const minCeilingSpace = 3; // Always show at least 3 lines of ceiling
       const maxWallHeight = SCREEN_HEIGHT - (minCeilingSpace * 2); // Reserve space for ceiling and floor
       
       const clampedWallHeight = Math.min(wallHeight, maxWallHeight);
       const ceiling = Math.max(minCeilingSpace, Math.floor((SCREEN_HEIGHT - clampedWallHeight) / 2));
       const floor = ceiling + Math.floor(clampedWallHeight);

       let wallShade = ' ';
       if (distanceToWall <= MAX_DEPTH / 4.0) wallShade = '█';
       else if (distanceToWall < MAX_DEPTH / 3.0) wallShade = '▓';
       else if (distanceToWall < MAX_DEPTH / 2.0) wallShade = '▒';
       else if (distanceToWall < MAX_DEPTH) wallShade = '░';
       else wallShade = ' ';

       for (let y = 0; y < SCREEN_HEIGHT; y++) {
         if (y < ceiling) {
           // Sky with subtle pattern for depth reference
           if (y < 2) {
             newScreen[y][x] = '.';
           } else {
             newScreen[y][x] = ' ';
           }
         } else if (y >= ceiling && y < floor) {
           newScreen[y][x] = wallShade; // Wall
         } else {
          // Floor shading based on distance
          const b = 1.0 - (y - SCREEN_HEIGHT / 2.0) / (SCREEN_HEIGHT / 2.0);
          let floorShade = ' ';
          if (b < 0.25) floorShade = '#';
          else if (b < 0.5) floorShade = 'x';
          else if (b < 0.75) floorShade = '.';
          else if (b < 0.9) floorShade = '-';
          else floorShade = ' ';
          newScreen[y][x] = floorShade;
        }
      }
    }

    // Render trophy if not collected and visible (not blocked by walls)
    if (!trophy.collected) {
      const distanceToTrophy = Math.sqrt(
        Math.pow(player.x - trophy.x, 2) + Math.pow(player.y - trophy.y, 2)
      );
      
      // Check if trophy is visible (no walls blocking the view)
      let trophyVisible = true;
      const stepSize = 0.1;
      const dirX = (trophy.x - player.x) / distanceToTrophy;
      const dirY = (trophy.y - player.y) / distanceToTrophy;
      
      for (let step = 0; step < distanceToTrophy; step += stepSize) {
        const checkX = Math.floor(player.x + dirX * step);
        const checkY = Math.floor(player.y + dirY * step);
        if (checkX >= 0 && checkX < MAZE_WIDTH && checkY >= 0 && checkY < MAZE_HEIGHT && maze[checkY][checkX] === 1) {
          trophyVisible = false;
          break;
        }
      }
      
      if (trophyVisible && distanceToTrophy < MAX_DEPTH) {
        const trophyAngle = Math.atan2(trophy.y - player.y, trophy.x - player.x);
        const angleDiff = trophyAngle - player.angle;
        
        // Normalize angle difference
        let normalizedAngle = angleDiff;
        while (normalizedAngle > Math.PI) normalizedAngle -= 2 * Math.PI;
        while (normalizedAngle < -Math.PI) normalizedAngle += 2 * Math.PI;
        
        if (Math.abs(normalizedAngle) < FOV / 2) {
          const trophyScreenX = Math.floor(SCREEN_WIDTH / 2 + normalizedAngle * SCREEN_WIDTH / FOV);
          const trophySize = Math.max(3, Math.floor(SCREEN_HEIGHT / (distanceToTrophy * 2)));
          const trophyStartY = Math.floor(SCREEN_HEIGHT / 2 - trophySize / 2);
          
          // 3D ASCII trophy model
          const trophyModel = [
            '   ♛   ',
            '  ███  ',
            ' █████ ',
            '███████',
            ' █████ ',
            '  ███  ',
            '   █   '
          ];
          
          // Render trophy model
           for (let row = 0; row < Math.min(trophyModel.length, trophySize); row++) {
             const modelRow = trophyModel[Math.floor(row * trophyModel.length / trophySize)];
             const yPos = trophyStartY + row;
             
             if (yPos >= 0 && yPos < SCREEN_HEIGHT) {
               for (let col = 0; col < modelRow.length; col++) {
                 const xPos = trophyScreenX - Math.floor(modelRow.length / 2) + col;
                 if (xPos >= 0 && xPos < SCREEN_WIDTH && modelRow[col] !== ' ') {
                   // Force gold color using specific gold block characters
                   const goldChars = ['▓', '▒', '░', '█'];
                   const rotationIndex = (Math.floor(animationRef.current / 5) + col + row) % goldChars.length;
                   // Use special marker to identify trophy characters for CSS styling
                   newScreen[yPos][xPos] = modelRow[col] === '█' ? goldChars[rotationIndex] : modelRow[col];
                 }
               }
             }
           }
        }
      }
    }

    // Add stats display
    const stats = `X:${player.x.toFixed(2)} Y:${player.y.toFixed(2)} A:${(player.angle * 180 / Math.PI).toFixed(0)}° ${trophy.collected ? 'TROPHY!' : ''}`;
    for (let i = 0; i < Math.min(stats.length, SCREEN_WIDTH); i++) {
      newScreen[0][i] = stats[i];
    }

    // Add controls info
    const controls = trophy.collected ? 'CONGRATULATIONS! You found the golden trophy!' : 'WASD: Move/Turn | Find the golden trophy!';
    for (let i = 0; i < Math.min(controls.length, SCREEN_WIDTH); i++) {
      newScreen[SCREEN_HEIGHT - 1][i] = controls[i];
    }

    // Mark trophy characters for gold styling
    const screenWithClasses = newScreen.map((row, y) => 
      row.map((char, x) => {
        // Check if this position contains a trophy character
        const isTrophyChar = !trophy.collected && 
          char !== ' ' && char !== '█' && char !== '▓' && char !== '▒' && char !== '░' && 
          char !== '#' && char !== 'x' && char !== '.' && char !== '-' &&
          (char === '♛' || (y >= Math.floor(SCREEN_HEIGHT / 2 - 4) && y <= Math.floor(SCREEN_HEIGHT / 2 + 4)));
        
        return {
          char: char,
          isTrophy: isTrophyChar
        };
      })
    );
    
    setScreen(screenWithClasses);
  }, [player, castRay]);

  // Handle player movement
  const updatePlayer = useCallback(() => {
    setPlayer(prevPlayer => {
      let newPlayer = { ...prevPlayer };

      if (keysPressed.current.has('w') || keysPressed.current.has('W')) {
        const newX = newPlayer.x + Math.cos(newPlayer.angle) * newPlayer.moveSpeed;
        const newY = newPlayer.y + Math.sin(newPlayer.angle) * newPlayer.moveSpeed;
        
        if (maze[Math.floor(newY)][Math.floor(newX)] === 0) {
          newPlayer.x = newX;
          newPlayer.y = newY;
        }
      }
      
      if (keysPressed.current.has('s') || keysPressed.current.has('S')) {
        const newX = newPlayer.x - Math.cos(newPlayer.angle) * newPlayer.moveSpeed;
        const newY = newPlayer.y - Math.sin(newPlayer.angle) * newPlayer.moveSpeed;
        
        if (maze[Math.floor(newY)][Math.floor(newX)] === 0) {
          newPlayer.x = newX;
          newPlayer.y = newY;
        }
      }
      
      if (keysPressed.current.has('a') || keysPressed.current.has('A')) {
        newPlayer.angle -= newPlayer.rotSpeed;
      }
      
      if (keysPressed.current.has('d') || keysPressed.current.has('D')) {
        newPlayer.angle += newPlayer.rotSpeed;
      }

      // Check trophy collision
      if (!trophy.collected) {
        const distance = Math.sqrt(
          Math.pow(newPlayer.x - trophy.x, 2) + Math.pow(newPlayer.y - trophy.y, 2)
        );
        if (distance < 0.5) {
          setTrophy(prev => ({ ...prev, collected: true }));
        }
      }

      return newPlayer;
    });
  }, [maze, trophy]);

  // Keyboard event handlers
  const handleKeyDown = useCallback((e) => {
    keysPressed.current.add(e.key);
    e.preventDefault();
  }, []);

  const handleKeyUp = useCallback((e) => {
    keysPressed.current.delete(e.key);
    e.preventDefault();
  }, []);

  // Mobile button handlers
  const handleButtonPress = useCallback((key) => {
    keysPressed.current.add(key);
  }, []);

  const handleButtonRelease = useCallback((key) => {
    keysPressed.current.delete(key);
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = setInterval(() => {
      animationRef.current += 1;
      updatePlayer();
      render();
    }, 50); // ~20 FPS

    return () => clearInterval(gameLoop);
  }, [updatePlayer, render]);

  // Trophy animation
  useEffect(() => {
    if (!trophy.collected) {
      const trophyAnimation = setInterval(() => {
        setTrophy(prev => ({
          ...prev,
          animationFrame: prev.animationFrame + 1
        }));
      }, 100);
      
      return () => clearInterval(trophyAnimation);
    }
  }, [trophy.collected]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Initial render
  useEffect(() => {
    render();
  }, [render]);

  return (
    <div className="maze-container" tabIndex={0}>
      <div className="maze-title">3D ASCII MAZE</div>
      <div className="maze-screen">
        {screen.map((row, y) => (
          <div key={y} className="maze-row">
            {row.map((charObj, x) => {
              const char = typeof charObj === 'object' ? charObj.char : charObj;
              const isTrophy = typeof charObj === 'object' ? charObj.isTrophy : false;
              return (
                <span key={x} className={`maze-char ${isTrophy ? 'trophy-char' : ''}`}>
                  {char}
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <div className="maze-instructions">
        <p>Use WASD keys to navigate the 3D maze!</p>
        <p>W/S: Move forward/backward | A/D: Turn left/right</p>
      </div>
      
      {/* Mobile Controls */}
      <div className="mobile-controls">
        <div className="control-row">
          <button 
            className="control-btn move-btn"
            onTouchStart={() => handleButtonPress('w')}
            onTouchEnd={() => handleButtonRelease('w')}
            onMouseDown={() => handleButtonPress('w')}
            onMouseUp={() => handleButtonRelease('w')}
            onMouseLeave={() => handleButtonRelease('w')}
          >
            ↑
          </button>
        </div>
        <div className="control-row">
          <button 
            className="control-btn turn-btn"
            onTouchStart={() => handleButtonPress('a')}
            onTouchEnd={() => handleButtonRelease('a')}
            onMouseDown={() => handleButtonPress('a')}
            onMouseUp={() => handleButtonRelease('a')}
            onMouseLeave={() => handleButtonRelease('a')}
          >
            ↺
          </button>
          <button 
            className="control-btn move-btn"
            onTouchStart={() => handleButtonPress('s')}
            onTouchEnd={() => handleButtonRelease('s')}
            onMouseDown={() => handleButtonPress('s')}
            onMouseUp={() => handleButtonRelease('s')}
            onMouseLeave={() => handleButtonRelease('s')}
          >
            ↓
          </button>
          <button 
            className="control-btn turn-btn"
            onTouchStart={() => handleButtonPress('d')}
            onTouchEnd={() => handleButtonRelease('d')}
            onMouseDown={() => handleButtonPress('d')}
            onMouseUp={() => handleButtonRelease('d')}
            onMouseLeave={() => handleButtonRelease('d')}
          >
            ↻
          </button>
        </div>
      </div>
    </div>
  );
};

export default Shop2;