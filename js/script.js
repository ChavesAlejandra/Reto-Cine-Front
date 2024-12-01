
document.addEventListener("DOMContentLoaded", (event) => {
    console.log("DOM fully loaded and parsed")

    const dropDownMenu = Array.from(document.getElementsByClassName("dropDownMenu"))
    const dropDownInfo = Array.from(document.getElementsByClassName("dropDownInfo"))
    const dropPrincipalMenu = document.getElementsByClassName("dropPrincipalMenu")
    const headerMenu = document.getElementsByClassName("header__principalMenu")[0]

    dropDownMenu.forEach((el, index) => {
        el.addEventListener("click", () => {
            if (dropDownInfo[index].style.visibility != "visible") {
                dropDownInfo[index].style.visibility = "visible"
            } else {
                dropDownInfo[index].style.visibility = "hidden"
            }
        })
    })
    headerMenu.addEventListener("click", () => {
        if (dropPrincipalMenu[0].style.visibility != "visible") {
            dropPrincipalMenu[0].style.visibility = "visible"
            dropPrincipalMenu[1].style.visibility = "visible"
            dropPrincipalMenu[2].style.visibility = "visible"
        } else {
            dropPrincipalMenu[0].style.visibility = "hidden"
            dropPrincipalMenu[1].style.visibility = "hidden"
            dropPrincipalMenu[2].style.visibility = "hidden"
        }
    })
})