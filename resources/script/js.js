document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('nav'),
        toggleSideBar = document.querySelector(".toggle");
    
    toggleSideBar.addEventListener('click' , () =>{
        sidebar.classList.toggle('close');
    });
});