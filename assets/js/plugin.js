jQuery(document).ready(function ($) {
  lazyLoad();

  const singlePageSwiperTabs = swiperInit({
    className: ".home_slider_section",
    breakpoints: false,
    observer: true,
    observeParents: true,
  });

  showPassword($);
  collapseFooterMenusInSmallScreens($);
  toggleSideMenuInSmallScreens($);
  stickyHeader($);
  verificationCodeSeprate();
  selectPIckerInit($);
  toggleHeaderSearchHover();
  customDropdownSelectAction();
  uploadProfilePhoto();
  chatScrollDirectionDown();
});

// functions init
function selectPIckerInit($) {
  $(".selectpicker").selectpicker();
}

function lazyLoad() {
  const images = document.querySelectorAll(".lazy-omd");

  const optionsLazyLoad = {
    //  rootMargin: '-50px',
    // threshold: 1
  };

  const preloadImage = function (img) {
    img.src = img.getAttribute("data-src");
    img.onload = function () {
      img.parentElement.classList.remove("loading-omd");
      img.parentElement.classList.add("loaded-omd");
      img.parentElement.parentElement.classList.add("lazy-head-om");
    };
  };

  const imageObserver = new IntersectionObserver(function (enteries) {
    enteries.forEach(function (entery) {
      if (!entery.isIntersecting) {
        return;
      } else {
        preloadImage(entery.target);
        imageObserver.unobserve(entery.target);
      }
    });
  }, optionsLazyLoad);

  images.forEach(function (image) {
    imageObserver.observe(image);
  });
}

function swiperInit(
  options = {
    className: "",
    breakpoints: null,
    observer: false,
    observeParents: false,
  }
) {
  return new Swiper(options.className + " .swiper-container", {
    spaceBetween: 30,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: options.className + " .swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: options.className + " .swiper-button-next",
      prevEl: options.className + " .swiper-button-prev",
    },
    breakpoints: options.breakpoints,
    observer: options.observer,
    observeParents: options.observeParents,
  });
}

function verificationCodeSeprate() {
  const inputElements = [...document.querySelectorAll("input.code-input")];

  inputElements.forEach((ele, index) => {
    ele.addEventListener("keydown", (e) => {
      // if the keycode is backspace & the current field is empty
      // focus the input before the current. The event then happens
      // which will clear the input before the current
      if (e.keyCode === 8 && e.target.value === "") {
        inputElements[Math.max(0, index - 1)].focus();
      }
    });
    ele.addEventListener("input", (e) => {
      if (e.target.value === "") {
        inputElements[index].classList = "code-input";
      } else {
        inputElements[index].classList = "code-input active";
      }

      // take the first character of the input
      // this actually breaks if you input an emoji like 👨‍👩‍👧‍👦....
      // but I'm willing to overlook insane security code practices.
      const [first, ...rest] = e.target.value;
      e.target.value = first ?? ""; // the `??` '' is for the backspace usecase
      const lastInputBox = index === inputElements.length - 1;
      const insertedContent = first !== undefined;
      if (insertedContent && !lastInputBox) {
        // continue to input the rest of the string
        inputElements[index + 1].focus();
        inputElements[index + 1].value = rest.join("");
        inputElements[index + 1].dispatchEvent(new Event("input"));
      }
    });
  });
}

function showPassword($) {
  $(".show-password-button-om").on("click", function (e) {
    e.preventDefault();

    if ($(this).parent().find("input").attr("type") == "text") {
      $(this).parent().find("input").attr("type", "password");
      $(this).removeClass("show-om");
    } else {
      $(this).parent().find("input").attr("type", "text");
      $(this).addClass("show-om");
    }
  });
}

function collapseFooterMenusInSmallScreens($) {
  if ($(window).width() <= 991) {
    $(".collapse-head-om").on("click", function (e) {
      e.preventDefault();

      $(".collapse-head-om")
        .not(this)
        .parent()
        .find(".list-collapse-om")
        .slideUp();
      $(this)
        .parent()
        .find(".list-collapse-om")
        .slideToggle({
          queue: false,
          complete: function () {
            $(".list-collapse-om").each(function () {
              if ($(this).css("display") == "none") {
                $(this).parent().removeClass("active");
              } else {
                $(this).parent().addClass("active");
              }
            });
          },
        });
    });
  }
}

function toggleSideMenuInSmallScreens($) {
  // nav men activation
  $("#menu-butt-activ-om").on("click", function (e) {
    e.preventDefault();

    $("#navbar-menu-om").addClass("active-menu");
    $(".overlay").addClass("active");
    $("body").addClass("overflow-body");
  });

  // nav men close
  $(".close-button__ , .overlay ").on("click", function (e) {
    e.preventDefault();
    $("#navbar-menu-om").removeClass("active-menu");
    $(".overlay").removeClass("active");

    $("body").removeClass("overflow-body");
  });
}

function stickyHeader($) {
  let lastScroll = 0;
  const fixedHeaderElement = $(".fixed_header__");

  $(document).on("scroll", function () {
    let currentScroll = $(this).scrollTop();

    const isScrollingDown = function () {
      return currentScroll < lastScroll && currentScroll > 500;
    };
    const isScrollingUp = function () {
      return currentScroll > lastScroll && currentScroll > 500;
    };

    const fixedHeightToHeaderWrapper = function (fixedHeaderElement) {
      const fixedHeaderElementHeight = fixedHeaderElement.innerHeight();
      $(".main_header__").css("height", fixedHeaderElementHeight);
    };

    fixedHeightToHeaderWrapper(fixedHeaderElement);

    if (isScrollingDown()) {
      fixedHeaderElement
        .addClass("active_menu__")
        .removeClass("not_active_menu__");
    } else if (isScrollingUp()) {
      fixedHeaderElement
        .removeClass("active_menu__")
        .addClass("not_active_menu__");
    } else {
      fixedHeaderElement.removeClass("active_menu__ not_active_menu__");
    }
    lastScroll = currentScroll;
  });
}

function toggleHeaderSearchHover() {
  let headerSearchButton = $(".header_search_input_wrapper");
  $("html").click(function (e) {
    headerSearchButton.siblings().removeClass("search_mode");
    headerSearchButton.removeClass("active");

    if($(e.target).hasClass("header_search_input_wrapper") || $(e.target).hasClass("icon__") || $(e.target).hasClass('header_search_input')) {
      headerSearchButton.siblings().addClass("search_mode");
      headerSearchButton.addClass("active");
    }
  });
}

function customDropdownSelectAction() {
  if (document.querySelector(".custom_dropdown__")) {
    document
      .querySelector(".custom_dropdown__")
      .querySelectorAll(".custom_dropdown_link__")
      .forEach(function (ele) {
        ele.addEventListener("click", function () {
          this.parentElement.previousElementSibling.innerHTML = `${this.innerHTML}`;
        });
      });
  }
}

function uploadProfilePhoto() {
  let uploadProfilePhotoInput = document.querySelector(
    ".upload_profile_photo_input"
  );
  if (!uploadProfilePhotoInput) {
    return;
  }

  uploadProfilePhotoInput.addEventListener(
    "change",
    function () {
      const reader = new FileReader();
      reader.onload = function () {
        $(".provider_profile_img_uploaded").attr("src", `${reader.result}`);
        $(".provider_img_block").removeClass("none_before_shape");
        $(".upload_profile_photo_label_overlay__").addClass("uploaded");
      };

      reader.readAsDataURL(uploadProfilePhotoInput.files[0]);
    },
    false
  );
}

function chatScrollDirectionDown() {
  let messageBody = document.querySelector(".chat_content__");
  if (!messageBody) {
    return;
  }

  messageBody.scrollTop = messageBody.scrollHeight;
}
