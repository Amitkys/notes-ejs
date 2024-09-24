const date = new Date('2024-09-24T09:33:40.964Z');
console.log(date.toLocaleTimeString('en-US', {
               hour: 'numeric',    
               minute: 'numeric',  
               second: 'numeric',  
               hour12: true,       
               timeZone: 'Asia/Kolkata'  // Set timezone to IST
}));
