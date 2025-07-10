function locoscroll() {
    gsap.registerPlugin(ScrollTrigger);

// Using Locomotive Scroll from Locomotive https://github.com/locomotivemtl/locomotive-scroll

const locoScroll = new LocomotiveScroll({
  el: document.querySelector("#main"),
  smooth: true
});
// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)
locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the "#main" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy("#main", {
  scrollTop(value) {
    return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
  }, // we don't have to define a scrollLeft because we're only scrolling vertically.
  getBoundingClientRect() {
    return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
  },
  // LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
  pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

console.log("Scrolling")

}

// Enhanced Custom Cursor Effect - More robust version
function cursorEffect() {
    const page1Content = document.querySelector("#page1-content");
    const cursor = document.querySelector("#cursor");
    const video=document.querySelector("video")
    const rejouice=page1Content.querySelector("h1");

    let isInside = false;

    // Initially hide cursor
    gsap.set(cursor, { scale: 0, opacity: 0 });

    // Global mouse movement listener with requestAnimationFrame for smoother performance
    let mouseMoveRAF;
    window.addEventListener("mousemove", function(e) {
        if (mouseMoveRAF) {
            cancelAnimationFrame(mouseMoveRAF);
        }
        
        mouseMoveRAF = requestAnimationFrame(() => {
            cursor.style.left = e.clientX + "px";
            cursor.style.top = e.clientY + "px";
        });
    });

    // Check if mouse is inside page1-content area
    function checkMouseInside(e) {
        const rect = page1Content.getBoundingClientRect();
        return e.clientX >= rect.left && 
               e.clientX <= rect.right && 
               e.clientY >= rect.top && 
               e.clientY <= rect.bottom;
    }

    // Global mouse move to check if inside area (works better with Locomotive Scroll)
    window.addEventListener("mousemove", function(e) {
        const shouldShow = checkMouseInside(e);
        
        if (shouldShow && !isInside) {
            isInside = true;
            gsap.to(cursor, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        } else if (!shouldShow && isInside) {
            isInside = false;
            gsap.to(cursor, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    page1Content.addEventListener("click",function(){
        video.muted =!video.muted;
         if (video.muted) { // Check the element's style.opacity
             gsap.to(rejouice, {      
                y:1,
                opacity:0.7,
                stagger:0.15, 
            });
        } else{
            gsap.to(rejouice, {      
                y:80,
                opacity:0,
                stagger:0.15, 
            });
        }

         
    })

    // Fallback event listeners
    page1Content.addEventListener("mouseenter", function(e) {
        if (!isInside) {
            isInside = true;
            gsap.to(cursor, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });

    page1Content.addEventListener("mouseleave", function(e) {
        if (isInside) {
            isInside = false;
            gsap.to(cursor, {
                scale: 0,
                opacity: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        }
    });
}

// Page 2 Animation

// Fixed Page 2 Animation
function page2Animation() {
    // Animate all h2 elements within .elem class
    gsap.from(".elem h2", {
        y: 120,
        stagger: 0.2,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: "#page2",
            scroller: "#main",
            start: "top 47%",
            end: "top 30%",
            scrub: 2,
            // markers: true // Add this temporarily to debug
        }
    });
}

function Swiperanimation(){
    var swiper = new Swiper(".mySwiper", {
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: true,
      }
    });
}

function timelines(){
    var tl=gsap.timeline();

    tl.from("#loader h3",{
        x:40,
        opacity:0,
        duration:1,
        stagger:0.1,
    })

    tl.to("#loader h3",{
        opacity:0,
        x:-40,
        stagger:0.1
    })

    tl.to("#loader",{
        opacity:0,
        display:"none"
    })

    tl.from("#page1-content h1 span",{
        y:100,
        opacity:0,
        stagger:0.15,
        duration:0.4,
        delay:-0.1
    })
}


// Initialize everything
async function init() {
    
    // Initialize cursor effect first
    await cursorEffect();
    
    // Then initialize Locomotive Scroll
    locoscroll();
    // Initialize page animations after a brief delay
    page2Animation();

    Swiperanimation();

    timelines();
}

// Wait for DOM to load
document.addEventListener("DOMContentLoaded", init);