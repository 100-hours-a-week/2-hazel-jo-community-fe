
// intersectionObserver API 
const intersectionObserver = new IntersectionObserver(function(entries) {
    //intersectiononRatio가 0이면 target이 화면에 보이지 않는 것 
    if(entries[0].intersectionRatio <= 0) {
        return; 
    }
    loadItems(10);
    console.log("loadItems");
});

intersectionObserver.observe(document.querySelector("#posts-container"));

// sentinel 요소가 화면에 보이면 페이지 불러오는 함수 호출 
const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        // entry가 intersecting 중이 아니면 함수를 실행하지 않음 
        if(!entry.isIntersecting) {
            return;
        }
        // 현재 페이지가 불러오는 중임을 나타내는 flag를 통해 불러오는 중이면 함수를 실행하지 않음
        if(page._scrollchk) {
            return; 
        }

        // observer를 등록 
        observer.observe(document.getElementById('sentinel'));
        // 불러올 페이지 추가 
        page._page += 1;
        // 페이지 불러오는 함수 호출
        page.list.search(); 
    });
});

io.observe(document.getElementById('sentinel'));

// 아이템이 로딩 되기 전 UI 
$.ajax({
    url: url,
    data: AudioParam,
    method: "GET",
    dataType: "json",
    success: function(result) {
        console.log(result);
    },
    error: function(err) {
        console.log(err);
    },
    beforeSend: function() {
        _scrollchk = true;

        document.getElementById('list').appendChild(skeleton.show());

        $(".loading").show();
    },

    complete: function() {
        _scrollchk = false;

        $(".loading").hide();
        skeleton.hide();
    }
       
});

// 지정된 대상 요소 관찰 중지하는 unobserve 메서드를 사용한 무한 스크롤 멈추기 
/*
const observer = new IntersectionObserver(callback);
observer.observe(document.getElementById("elementToObserve"));

observer.unobserve(document.getElementById("elementToObserve")); 
*/

// 관찰중인 요소를 DOM에서 숨기는 방식을 사용한 무한 스크롤 멈추기 
if(_total === 0) {
    $('#sentinel').hide();
} else {
    if(_total <= _page * 10) {   //검색된 아이템이 10개 이하일 경우 관찰중인 요소를 숨김 
        $('#sentinel').hide();
    } else {
        $('#sentinel').show();
    }
}