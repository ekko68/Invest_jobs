/* ==============================
 * 작성일 : 2019-06-01
 * 작성자 : 안효주, 장영석
 * 작성자의 허락없이 무단 도용시 고발 조치 합니다.
 * ============================== */

$(function(){

	/* ==============================
	 * common
	 * ============================== */
	$('.btnMenu').click(function(){
		$('.subMenuWrap').toggleClass('on').find('.AllMenu').removeAttr('style');
		$('body').addClass('scrollLock');
		return false;
	});
	
	$('.subMenuWrap .bg').click(function(){
		$(this).closest('.subMenuWrap').removeClass('on');
		$('body').removeClass('scrollLock');
		return false;
	}).on('touchstart',function(e){
		var $this = $(this),
			pageX = e.originalEvent.targetTouches[0].pageX,
			moveX,endX;
		
		$this.on('touchmove',function(e){
			moveX = e.originalEvent.targetTouches[0].pageX;
			var left = -((pageX-moveX)/2); 
			$('.subMenuWrap .AllMenu').css('margin-left',left > 0 ? 0 : left);
		});
		
		$this.on('touchend',function(e){
			if((pageX - moveX) > 30){
				$(this).closest('.subMenuWrap').removeClass('on');
				$('body').removeClass('scrollLock');
			}else{
				$('.subMenuWrap .AllMenu').animate({'margin-left':0},'fast');
			}
			
			$this.off('touchmove');
			$this.off('touchend');
		});
		
	});

	layerpopup(); // 팝업 호출
	
});	

$(function(){

	/* ==============================
	 * common
	 * ============================== */	
	/*$('.btnMenu').click(function(){
		$('.headerMenu').toggleClass('on').find('.AllMenu').removeAttr('style');
		$('body').addClass('scrollLock');
		return false;
	});
	
	$('.headerMenu .bg').click(function(){
		$(this).closest('.headerMenu').removeClass('on');
		$('body').removeClass('scrollLock');
		return false;
	}).on('touchstart',function(e){
		var $this = $(this),
			pageX = e.originalEvent.targetTouches[0].pageX,
			moveX,endX;
		
		$this.on('touchmove',function(e){
			moveX = e.originalEvent.targetTouches[0].pageX;
			var left = -((pageX-moveX)/2); 
			$('.headerMenu .AllMenu').css('margin-left',left > 0 ? 0 : left);
		});
		
		$this.on('touchend',function(e){
			if((pageX - moveX) > 30){
				$(this).closest('.headerMenu').removeClass('on');
				$('body').removeClass('scrollLock');
			}else{
				$('.headerMenu .AllMenu').animate({'margin-left':0},'fast');
			}
			
			$this.off('touchmove');
			$this.off('touchend');
		});
		
	});

	layerpopup();*/  // 팝업 호출
	
	
	/*
	 * 캘린더 
	 */
	if($('.calender').length){
		$('.calender input').each(function(){
			$(this).datepicker({
				prevText : "이전달",
				nextText : "다음달",
				monthNames:["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
				monthNamesShort:["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"],
				dayNamesMin:["일","월","화","수","목","금","토"],
				dayNamesShort:["일","월","화","수","목","금","토"],
				dateFormat:"yy.m.d"
			});
		});
	};
	

	/* ==============================
	 * gnb
	 * ============================== */
	headerCommon();

	/* ==============================
	 * main
	 * ============================== */

	/* ==============================
	 * content
	 * ============================== */
	
	
});



function headerCommon(){
	
	swipeOpen()
	function swipeOpen(){
		$('.slickTab').each(function(){
			var winW = $(window).outerWidth();
			var tabW = 0;
			
			$(this).find('.swiper-slide').each(function(){
				tabW += $(this).outerWidth(); 
			});
			
			if(tabW < winW){
				$(this).find('.swiper-wrapper').addClass('flex')
			}else{
				var swiper = new Swiper('.slickTab',{
					slidesPerView:'auto'
				});
			}
			
		})
	}
	
	$(document).on('click','.subMenu > li > a',function(){
		if($(this).siblings().length){
			$(this).toggleClass('on').siblings('.depth2').slideToggle();
			return false;
		}
	});
	
	$(document).on('click','.subMenu .depth2 li > a',function(){
		$(this).toggleClass('on').siblings('.depth3').slideToggle();
		return false;
	});
	
}

/* 레이어 팝업 */
function layerpopup(){
	$(document).on('click','.layerPopOpen',function(){
		var href = $(this).attr('href');
		if(!href){
			href = $(this).data('href');
		}
		layerPopOpen(href);
		return false;
	});
	
	layerPopClose();
}

function layerPopOpen(target,change){
	var winH = $(window).outerHeight(true),popH;
	var cont = $(target).find('.layerPopCont');
	$(target).addClass('on');
	//popContposition();
	//$(window).resize(function(){popContposition();});
	
	
	function popContposition(){
		popH = cont.outerHeight();
		winH = $(window).outerHeight(true);
		if(popH > winH){
			cont.css({'top':'0','margin-top':0});
		}else{
			cont.css({'top':'50%','margin-top':-popH/2});
		}	
	}
	$('body').addClass('scrollLock');
	
}

function layerPopClose(){
	$(document).on('click','.btnPopClose',function(){
		$(this).closest('.layerPopWrap').removeClass('on');
		$('body').removeClass('scrollLock');
		$(this).closest('.layerPopCont').removeAttr('style');
		return false;
	});
	$(document).on('click','.bg',function(){
		$(this).closest('.layerPopWrap').removeClass('on');
		$('body').removeClass('scrollLock');
		$(this).siblings('.layerPopCont').removeAttr('style');
		return false;
	});
}





/* parallax scrolling motion */
/*
	data-animation
	data-delay : 지연시간 1초 = 1000
	data-duration : 동작시간 1초 = 1000

	[waypoint]
	data-waypoint-once : 한번만 쓸지
	data-waypoint-point : 동작 포인트 (퍼센트)
*/

animation();
function animation(){
	hoverAnimation();
	scrollAnimation();
	numberAnimation();
	textAnimation();
}

function textAnimation(){
	$(window).load(function(){
		var $elements = $( '*[data-text-animation]' );
		var h = $(window).height();

		$elements.each( function( i, el ) {
			var $el = $( el );
			var animation = $el.data('text-animation'),
				number = $el.text(),
				timer;

			var _duration = 100,
			_delay = 0;
			if($el.data('duration') > 0) _duration = $el.data('duration');
			if($el.data('delay') > 0) _delay = $el.data('delay');

			$el.addClass(animation);

			textMotionType2($el,_duration,_delay);

			$el.waypoint(function(e){
				if(e == 'down'){
					textMotionType2($el,_duration,_delay);
				};
			}, { offset: waypointerCheck($el)[0] +'%',triggerOnce: waypointerCheck($el)[1]});
		});
	});
};

function numberAnimation(){
	$(window).load(function(){
		var $elements = $( '*[data-number-animation]' );
		var h = $(window).height();

		$elements.each( function( i, el ) {
			var $el = $( el );
			$el.css('opacity',1);
			if($el.data('number-animation') == 'count'){
				var _duration = 800,
					_delay = 0;
				var num = Math.floor($el.text());
				if($el.data('duration') > 0) _duration = $el.data('duration');
				if($el.data('delay') > 0) _delay = $el.data('delay');
				waypointerCheck($el);
				$el.waypoint(function(e){
					if(e == 'down'){
						$({val:0}).stop().delay(_delay).animate({val:num},{
							duration:_duration,
							step:function(){$el.text(addComma(Math.floor(this.val)))},
							complete:function(){$el.text(addComma(Math.floor(this.val)))}
						});
					};
				}, { offset: waypointerCheck($el)[0] +'%',triggerOnce: waypointerCheck($el)[1]});
			}else if($el.data('number-animation') == 'updown'){
				var $el = $( el );
				var number = $el.text();
				$el.text(addComma(Math.floor(number)));
				var split = $el.text().split('');
				var textHeight = 0;
				$el.text('');

				$.each(split,function(e){
					$('<div class="JSnumberMotionRow"><div></div></div>').appendTo($el)

					if(split[e] == ','){
						$el.find('.JSnumberMotionRow').eq(e).text(',');
					}else{
						var text = 0;
						for(var i = 0; i<20; i++){
							$('<div class="JSnumberMotion"></div>').appendTo($el.find('.JSnumberMotionRow').eq(e).children()).text(text)
							text >= 9 ? text = 0 : text++;
						};
					};

					textHeight = $el.find('.JSnumberMotion').height();
					$el.css('height',textHeight).find('.JSnumberMotionRow,.JSnumberMotion').css('height',textHeight);

					//motion();
					$el.waypoint(function(e){
						if(e == 'down'){
							motion();
						};
					}, { offset: waypointerCheck($el)[0] +'%',triggerOnce: waypointerCheck($el)[1]});
					function motion(){
						var random = Math.floor((Math.random() * 1000) + 500);
						$el.find('.JSnumberMotionRow').eq(e).children().css('margin-top','0').animate({'margin-top':-textHeight*(Math.abs(split[e]) + 10)},random,function(){
							// 초기화
							//$el.find('.JSnumberMotionRow').eq(e).children().css('margin-top','0').find('.JSnumberMotion').eq(split[e]).siblings().remove();
						});
					};
				});
			}else{
				var animation = $el.data('number-animation'),
					number = $el.text(),
					timer;
				var _duration = 100,
					_delay = 0;
				$el.addClass(animation).text(addComma(Math.floor(number)));
				if($el.data('duration') > 0) _duration = $el.data('duration');
				if($el.data('delay') > 0) _delay = $el.data('delay');

				textMotionType2($el,_duration,_delay);

				$el.waypoint(function(e){
					if(e == 'down'){
						textMotionType2($el,_duration,_delay);
					};
				}, { offset: waypointerCheck($el)[0] +'%',triggerOnce: waypointerCheck($el)[1]});
			}
		});
	});
}

/* 숫자 정규식 */
function addComma(num){
	var regexp = /\B(?=(\d{3})+(?!\d))/g;
	return num.toString().replace(regexp,',');
};

/* 클릭시 함수 호출 */
function textEffect(target,val){
	var $el = $(target),
	animation = $el.data('texteffect2'),
	number = val,
	timer;
	var _duration = 100,
		_delay = 0;
	$el.addClass(animation).text(addComma(Math.floor(number)));
	if($el.data('duration') > 0) _duration = $el.data('duration');
	if($el.data('delay') > 0) _delay = $el.data('delay');

	textMotionType2($el,_duration,_delay);
}

function textMotionType2(target,duration,delay){
	var timer;
	var split = target.text().split('');
	var last = split.length -1;

	target.text('');
	target.empty();
	clearTimeout(timer);
	$.each(split,function(e){
		$('<span class="JStextMotion"></span>').appendTo(target).text(split[e]).addClass(split[e] == ' ' ? 'space' : '');
		timer = setTimeout(function(){
			target.find('.JStextMotion').eq(target.data('reverse') ? last -e : e).addClass('on');
		},e*duration);
	});
}

function waypointerCheck(target){
	var Wpoint = 100,
		Wonce = false;
	if(target.data('waypoint-point')) Wpoint = target.data('waypoint-point');
	if(target.data('waypoint-once')) Wonce = target.data('waypoint-once');

	return [Wpoint,Wonce];
}

function scrollDD(target){
	$delay = target.data('delay'),
    $duration = target.data('duration');
	if($delay>0){target.css({'-webkit-animation-delay':$delay+'ms','animation-delay':$delay+'ms'})}
	if($duration>0){target.css({'-webkit-animation-duration':$duration+'ms','animation-duration':$duration+'ms'})}
}

function scrollAnimation(){
	$(window).load(function(){
		var $elements = $( '*[data-animation]' );
		var h = $(window).height();
		$elements.each( function( i, el ) {
			var $el = $( el ),
			    animationClass = $el.data('animation'),
			    $delay = $el.data('delay'),
			    $duration = $el.data('duration');
			var check = true;

			scrollDD($el);

			var t = $el.offset().top;
			if(t > h*waypointerCheck($el)[0]/100){
				$el.addClass('wait-animation');
			}
			$el.addClass('animated '+animationClass);

			$el.waypoint(function(){
				if(check){
					check = false;
					$el.removeClass('wait-animation');
				}else{
					check = true;
					$el.removeClass('animated '+animationClass);

					setTimeout(function(){
						$el.addClass('wait-animation animated '+animationClass);
					},10)
				}
			}, { offset: waypointerCheck($el)[0] +'%',triggerOnce: waypointerCheck($el)[1]});
		});
	});
};

function hoverAnimation(){
	$(window).load(function(){
		var $elements = $( '*[data-hover]' );
		var h = $(window).height();
		$elements.each( function( i, el ) {
			var $el = $( el ),
				animationClass = $el.data('hover'),
				$delay = $el.data('delay'),
				$duration = $el.data('duration'),
				$color = $el.data('color');
			var check = true;

			$el.append('<div class="after"></div><div class="before"></div>');

			scrollDD($el);

			/* line 색상만*/
			if($color && $el.data('hover').indexOf('line') >= 0){
				$el.find('.after').add($el.find('.before')).css({
					'background':$color
				})
			}
			$el.addClass('transition '+animationClass);
		});
	});
};


//랜덤값 추출
function randomNumber(min,max,point){
	return ((Math.random() * (max-min)) + min).toFixed(point);
};

//완료 인터렉션
function complateEffect(wrap,length){
	if(length > 20)length = 20;
	var $wrap = $(wrap),
		$itemLength = length,
		rdClass, rdClass2, rdLeft, rdTop, rdDelay,rdDirection, rdSpeed,
		rdLeftAry = [];
	for(var i = 0; i < $itemLength;i++){
		rdClass = randomNumber(1,3,0);
		//rdColor = randomNumber(1,3,0);
		rdColor = (i%3) + 1;
		rdLeft = randomNumber(0,20,0) * 5;
		rdTop = randomNumber(4,18,0) * 5;
		rdDelay = randomNumber(0,30,0) * 100;
		rdDirection = randomNumber(1,6,0);
		rdSpeed = randomNumber(30,70,0) * 100;

		if(rdLeftAry.indexOf(rdLeft) >= 0){		//left 랜덤값 겹치지않게
			i--;
		}else{
			rdLeftAry.push(rdLeft);
			if($wrap.hasClass('type2')){
				//코인
				rdSpeed = randomNumber(30,70,0) * 50;
				$wrap.prepend('<span class="item size'+rdClass+'" style="left:'+rdLeft+'%;animation:confettiDrop '+rdSpeed+'ms infinite ease-out '+rdDelay+'ms;"></span>');
			}else if($wrap.hasClass('type3')){
				//깜빡임
				rdSpeed = randomNumber(30,70,0) * 50;
				$wrap.prepend('<span class="item item'+rdClass+' color'+rdColor+'" style="left:'+rdLeft+'%;top:'+rdTop+'%;animation:confettiFlash '+rdSpeed+'ms infinite"></span>');
			}else{
				//꽃가루
				$wrap.prepend('<span class="item color'+rdColor+'" style="left:'+rdLeft+'%;animation:confettiSwing'+rdDirection+' '+(rdSpeed/2)+'ms infinite '+rdDelay+'ms, confettiDrop '+rdSpeed+'ms infinite ease-out '+rdDelay+'ms;"></span>');
			}
		}
	}
};

/* id background-fixed 해결안 */
ie_backgroundFixed();
function ie_backgroundFixed(){
	if(navigator.userAgent.match(/Trident\/7\./)){
		$('html,body').on('mousewheel',function(){
			event.preventDefault();

			var wheelDelta = event.wheelDelta;
			var currentScrollPosition = window.pageYOffset;
			window.scrollTo(0,currentScrollPosition - wheelDelta);
		});

		$('html, body').keydown(function(e){
			var wheelDelta = event.wheelDelta;
			var currentScrollPosition = window.pageYOffset;

			switch(e.which){
				case 38 : //up
					e.preventDefault();
					window.scrollTo(0,currentScrollPosition - 120);
					break;

				case 40 : //down
					e.preventDefault();
					window.scrollTo(0,currentScrollPosition + 120);
					break;
			}
		});
	};
}


//swiper
//if($('.swiper').size() != 0){
//	 $('.swiper').slick({
//	  dots: true,
//	  arrows:true,
//	  roof:false,
//	  infinite: false,
//	  speed: 1300
//	});
//}
//
//if($('.loding-act').size() > 0){
//	//http://kottenator.github.io/jquery-circle-progress/
//	var lodingActVal = parseInt($('.loding-act .loding-txt span').text());
//	$('.loding-act').circleProgress({
//	  value: lodingActVal/100, //변수값
//	  startAngle:-Math.PI / 2, //스타트 지점설정
//	  fill : { color:"red"}, //색상값
//	  emptyFill:'silver', //뒷 색상값
//	  size:120 // 전체 사이즈
//	}).on('circle-animation-progress', function(event, progress) {
//	  $(this).find('.loding-txt').html('진도율 <br /><span>' + parseInt(lodingActVal * progress) + '%</span>');
//	});
//}


//////////////accordion
$(document).on('click','.accordion dt a',function(){
	//$('.accordion dd').not($(this).parent().next()).slideUp();
	$(this).parent().toggleClass('on').next().slideToggle();
	return false;
});

/* filedrag.js */

//파일삭제
$(document).on('click','.messages a', function() {
	var thisFile = $(this).parent();
	var thisWrap = $(this).parent().parent();
	thisFile.remove();
	if (thisWrap.find('.file-box').length < 1) {
		thisWrap.parent().find('.filedrag_inner').removeClass('none');
	}
});
//파일드래그
$(document).on('dragover', '.filedrag', function(e) {
	e.stopPropagation();
	e.preventDefault();
	if (e.type == "dragover") {
		$(e.target).addClass("hover");
	} else {
		$(e.target).removeClass("hover");
	}
});
//파일드래그 벗어날 경우
$(document).on('dragleave', '.filedrag', function(e) {
	e.stopPropagation();
	e.preventDefault();
	if (e.type == "dragover") {
		$(e.target).addClass("hover");
	} else {
		$(e.target).removeClass("hover");
	}
});
//파일드롭
$(document).on('drop', '.filedrag', function(e) {
	e.preventDefault();
	if (e.type == "dragover") {
		$(e.target).addClass("hover");
	} else {
		$(e.target).removeClass("hover");
	}

	var boxWrap = $(e.target).parent().parent();
	var files = e.target.files || e.originalEvent.dataTransfer.files;
	for (var i = 0, f; f = files[i]; i++) {
		boxWrap.find('.messages').prepend(fileBoxDraw(f));
	}
	if (boxWrap.find('.messages .file-box').length) {
		boxWrap.find('.filedrag_inner').addClass('none');
	}
});
//파일추가
$(document).on('change', '.fileselect', function(e) {
	var boxWrap = $(e.target).parent().parent();
	var files = e.target.files || e.originalEvent.dataTransfer.files;
	for (var i = 0, f; f = files[i]; i++) {
		boxWrap.find('.messages').prepend(fileBoxDraw(f));
	}
	if (boxWrap.find('.messages .file-box').length) {
		boxWrap.find('.filedrag_inner').addClass('none');
	}
});

function fileBoxDraw(file) {
	var html = "";
	html += '<div class="file-box">';
	html += '<span class="file-name">' + file.name + '</span>';
	html += '<a href="javascript:;" class="file_del">';
	html += '<img src="../static_m/images/PB/btn_certificate.png">';
	html += '</a>';
	html += '</div>';
	return html;
}

//파일이미지삭제
$(document).on('click','.file-box_img a', function() {
	var thisFile = $(this).parent();
	var thisWrap = $(this).parent().parent();
	thisFile.remove();
});
//파일이미지추가
$(document).on('change', '.fileselect_img', function(e) {
	var boxWrap = $(e.target).parent().parent();
	var files = e.target.files || e.originalEvent.dataTransfer.files;
			
	for (var i = 0, f; f = files[i]; i++) {
		boxWrap.find('.filedrag_graybox').prepend(fileBoxDraw_img(f));
	}
	if (boxWrap.find('.filedrag_graybox .file-box').length) {
		boxWrap.find('.filedrag_inner').addClass('none');
	}
	
	//이미지 추가
	var preview = document.querySelector('.filedrag_graybox .file-box_img');
	var file = document.querySelector('.preview').files;
	
	function readAndPreview(file){
		
		if( /\.(jpg?g|png|gif)$/i.test(file.name) ){
			var reader = new FileReader();
			
			reader.addEventListener("load", function(){
				var image = new Image();
				image.title = file.name;
				image.src = this.result;
				preview.appendChild(image);
			}, false);
			reader.readAsDataURL(file);
		}
	}
	if (file){
		[].forEach.call(file, readAndPreview);
	}
});
function fileBoxDraw_img(file) {	
	var html = "";
	html += '<div class="file-box_img">';
	//html += '<img class="file_img" src="' +  + '">';
	html += '<a href="javascript:;" class="file_del">';
	html += '<img src="../static_m/images/PB/btn_img_del.png">';
	html += '</a>';
	html += '</div>';
	return html;
}
/*//filedrag.js */

///////////////// 트리구조 체크박스
$(function(){	
	$("[class^='category-']").on('change', function()
	{
	    $this_checkbox = $(this)
	    var class_name = $this_checkbox.attr('class');
	    var checked = $('[class="'+class_name+'"]').is(":checked");
	
	    $("[class^='"+class_name+"']").prop('checked', checked );// 하위요소 전부 체크or해제
	    checkbox_checked(class_name, checked);
	});
	
	function checkbox_checked(class_name, checked )
	{
	    if( class_name.indexOf('-') == -1) return;
	
	    var parent_class_name = class_name.substr(0, class_name.lastIndexOf('-') );
	    var friend_class = class_name.substr(0, (class_name.lastIndexOf('-') + 1) );
	
	    if( checked )//체크일경우
	    {
	        var i=0;
	        var node = $('input:checkbox:regex(class,'+ friend_class + '[0-9]$)');
	        if( node.length == node.filter(":checked").length )
	            $('.' + parent_class_name ).prop('checked', true );
	    }
	    else //해제일경우
	    {
	        $("[class^='"+class_name+"']").each( function(index, item)
	        {
	            var parent_class_name = class_name.substr(0, class_name.lastIndexOf('-') );//상위단원 class가져오기
	            child_checked = $(this).is(':checked');
	            if( !child_checked && parent_class_name != 'category')//하위단원을 체크 해제했을경우 상위단원 체크 해제 부분
	            {
	                $('.'+parent_class_name).prop('checked', child_checked );
	                return false;
	            }
	        });
	    }
	    checkbox_checked(parent_class_name, checked )
	}
	
	function get_checked_category()// 카테고리 체크박스 트리중에 하위단원 걸러내기.
	{
	
	    var reg = null
	    var category_ids = new Array();
	    var temp = new Array();
	    $("[class^='category-']:checked").each( function(index, item)
	    {
	        var my_class_name = $(this).attr('class');
	        if( index == 0 )
	        {
	            reg = new RegExp(my_class_name+"-"+'[0-9]');
	            category_ids.push( $(this).val() );
	            temp[$(this).val()] = $(this).closest('li').html();
	            return true;
	        }
	
	        if( fx_empty( my_class_name.match(reg) ) )
	        {
	            reg = new RegExp(my_class_name+"-"+'[0-9]');
	            category_ids.push( $(this).val() );
	            temp[$(this).val()] = $(this).closest('li').html();
	        }
	    });
	
	    return temp;
	}
	
	// 제이쿼리 정규표현식 ex) $('div:regex(class,[0-9])'); 클래스명에 숫자가 들어간것 select
	jQuery.expr[':'].regex = function(elem, index, match) {
	    var matchParams = match[3].split(','),
	        validLabels = /^(data|css):/,
	        attr = {
	            method: matchParams[0].match(validLabels) ?
	                        matchParams[0].split(':')[0] : 'attr',
	            property: matchParams.shift().replace(validLabels,'')
	        },
	        regexFlags = 'ig',
	        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
	    return regex.test(jQuery(elem)[attr.method](attr.property));
	}
	
	function fx_empty( value )//empty check
	{
		if( value == null || value == "" || value == "undefined" || value == undefined )
	        return true;
	
		return false;
	}
});

//LB

// 정보제공동의 체크
/*$(document).on('click','.agree_chkbtn',function(){
	$(this).parent().find('.tolltopBox').toggleClass('on');
	return false;
});
$(document).ready(function(){
	$(".agree_chkbtn").click(function(){
		var chkall = $('.noround_chk').prop("checked");	
		if(chkall){
			$(".agree_chkbtn").removeClass("on");
		}else {
			$(".agree_chkbtn").addClass("on");
		}
	});
	
});*/

// M관련

// 메인 슬라이드
$(function() {		
	var swiper = new Swiper('.MainSlide', {
		slidesPerView: 1,
		spaceBetween: 15,
		centeredSlides: true,
		pagination: {
			el: '.swiper-pagination',
			type: 'progressbar',
		}
	});	
});

// 아코디언
	$(document).on('click','.accordionBtn',function(){
		//$('.accordionHeader').not($(this).closest('.accordionHeader')).removeClass('on').parent().next().slideUp('fast');
		//$(this).closest('.accordionHeader').toggleClass('on').parent().next().slideToggle('fast');
		$(this).closest('.accordionHeader').toggleClass('on').parent().children('.accordionContent').slideToggle('fast');
		return false;
	});

// 탭랩	
	$(function() {		
		$(".Tabarea .subTabWrap").each(function(){
			var tabMenu1 = $(this).children().find('li');
			var tabMenu = $(this).children().children().find('a');
			var tabItem = $(this).parent().children('.jsTabCont').find('.TabListBox');
			
			tabMenu.on('click', function(){
				var idx = tabMenu.index(this);
				tabItem.hide().eq(idx).show();
				tabMenu1.removeClass('on').eq(idx).addClass('on');
			});
			tabMenu.eq(0).click();
		});
		
		$(".Tabarea .TabListBox .tabStyle").each(function(){
			var tabMenu1 = $(this).children().find('li');
			var tabMenu = $(this).children().children().find('a');
			var tabItem = $(this).parent().children('.inner_wrap');
			
			tabMenu.on('click', function(){
				var idx = tabMenu.index(this);
				tabItem.hide().eq(idx).show();
				tabMenu1.removeClass('on').eq(idx).addClass('on');
			});
			tabMenu.eq(0).click();
		});
	});
	
// 슬라이드
$(function() {		
	// .tabStyle2 
	/*var swiper1 = new Swiper('.tabStyle2', {
		slidesPerView: 2,
		spaceBetween: 0,
		navigation: {
			nextEl: '.swipernext1',
			prevEl: '.swiperprev1',
		}
	});*/
	
	// .tabStyle3 
	/*var swiper2 = new Swiper('.tabStyle3', {
		slidesPerView: 3,
		spaceBetween: 0,
		navigation: {
			nextEl: '.swipernext2',
			prevEl: '.swiperprev2',
		}
	});	*/
});

// 별아이콘
$(document).on('click','.btnStar',function(){
	$(this).toggleClass('on');
	return false;
});

//툴박스
$(document).on('click','.btnTooltip',function(){
	$(this).parent().find('.tolltopBox').toggleClass('on');
	return false;
});
$(document).on('click','.tolltopBox',function(){
	$(this).toggleClass('on');
	return false;
});

// 메인 슬라이드
$(function() {		
	var swiper3 = new Swiper('.M_slick', {
		slidesPerView: 4.5,
		spaceBetween: 0,
		freeMode: true,
		/*navigation: {
			nextEl: '.swipernext3',
			prevEl: '.swiperprev3',
		}*/
	});	
});
$(document).on('click','.M_slick ul li',function(){
	$(this).toggleClass('on');
	$('.M_slick ul li').not($(this).closest('.M_slick ul li')).removeClass('on')
	return false;
});

// 하단 슬라이드
$(function() {		
	var swiper4 = new Swiper('.PB0201-8 .slideWrap', {
		slidesPerView: 1.15,
		spaceBetween: 15,
		centeredSlides: true,
	});	
});

/* 기간조회  */
$(document).on('click','.pick1',function(){
	$(this).toggleClass('on');
	if($(this).hasClass('pick_select') === true) {
		$('.pick_select_date').addClass('on');
	}else {
		$('.pick_select_date').removeClass('on');
	}
	$('.pick1').not($(this).closest('.pick1')).removeClass('on')
	return false;
});

/* 할부조회  */
$(document).on('click','.pick2',function(){
	$(this).toggleClass('on');
	$('.pick2').not($(this).closest('.pick2')).removeClass('on')
	return false;
});

/* 할부개월 선택 */
$(document).on('click','.pickWrapPop .contBox ul li',function(){
	var pickTxt = $('.pickWrapPop .contBox ul li.on a').text();
	
	$(this).toggleClass('on');
	$('.pickWrapPop .contBox ul li').not($(this).closest('.pickWrapPop .contBox ul li')).removeClass('on')
	if($(this).hasClass('on') === true) {
		$('.pick.layerPopOpen').html(pickTxt);
	}else {
		//text( textString );
	}
	return false;
});

//클릭시 영역 노출
$(document).on('click','.clickbtn',function(){
	$('.clickveiw').toggleClass('on');
	return false;
});

$(document).ready(function(){
	$('.checkList.checkList_line.gap2 .radioBox label').click(function(){
		$(this).toggleClass('on');
		$('.checkList.checkList_line.gap2 .radioBox label').not($(this).closest('.checkList.checkList_line.gap2 .radioBox label')).removeClass('on')
		if($(this).hasClass('clickbtn') === true) {
			$(this).parent().parent().parent().children('.clickveiw').addClass('on');
		}else {
			$(this).parent().parent().parent().children('.clickveiw').removeClass('on');
		}	
		return false;
	});
	
});

/* selectbox 화살표변경  */
$(document).on('click','.selectBox',function(){
	$(this).toggleClass('on');
	return false;
});

/* 모두동의  */
$(document).ready(function(){
	$(".allchkbox input").click(function(){
		var chkall = $(this).prop("checked");	
		if(chkall){
			$(".allchkbox").addClass("on");
		}else {
			$(".allchkbox").removeClass("on");
		}
	});
	
});

/* main_tapwrap */
$(document).on('click','.main_tapwrap ul li',function(){
	$(this).toggleClass('on');
	$('.main_tapwrap ul li').not($(this).closest('.main_tapwrap ul li')).removeClass('on')
	return false;
});

/* 특정 a링크 클릭효과  2021-11-11추가 */
$(document).ready(function() {
	$('.active_element').on({
		'touchstart' : function () {
			$(this).addClass('click_active');
		},
		'touchend' : function () {
			$(this).removeClass('click_active');
		}
	});
});	
