// Initial variable declarations
let btn_close = document.querySelector('button');
let container_info = document.querySelector('.member_board');

// Function to hide all member info panels
function hideAllMemberInfoPanels() {
    // Select all the member info panels
    let member_info_panels = document.querySelectorAll('.member_board > .member_inner > div');
    member_info_panels.forEach(panel => {
        panel.classList.remove("show");
        panel.classList.add("hide");
        setTimeout(function () {
            panel.classList.remove("hide");
        }, 1000);
    });
}

// Event listener for each member's image click
document.querySelectorAll('.member img').forEach(img => {
    img.addEventListener('click', function(e) {
        hideAllMemberInfoPanels(); // Hide all panels first

        let memberClass = e.target.alt + '_board'; // Construct the class name from the image alt attribute
        let memberInfoPanel = document.querySelector('.' + memberClass);

        container_info.classList.add("show");
        memberInfoPanel.classList.add("show");
    });
});

// Event listener for the close button
btn_close.addEventListener('click', function toggleClose(e) {
    console.log(e.target);
    hideAllMemberInfoPanels(); // Hide all panels when close button is clicked
    container_info.classList.remove("show");
});
