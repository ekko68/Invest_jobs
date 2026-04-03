<%@page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>404</title>
    <style>
        body {
            height: 100%;
            overflow: hidden
        }

        .not_found_wrap {
            overflow-y: auto;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .not_found_wrap .not_found_container {
            text-align: center;
        }

        .not_found_wrap .not_found_title {
            color: #dddddd;
            font-size: 200px;
            font-weight: 700;
        }

        .not_found_wrap .not_found_main_text {
            font-size: 30px;
            color: #0a89ff;
            line-height: 1.2;
            letter-spacing: -0.03em;
            margin-bottom: 16px;
        }

        .not_found_wrap .not_found_main_text .p01 {
            font-weight: 600;
        }

        .not_found_wrap .not_found_sub_text {
            font-size: 20px;
            color: #666666;
            line-height: 1.3;
            margin-bottom: 30px;
        }

        .not_found_wrap .btn_group {
            display: flex;
            justify-content: center;
            align-items: center;
            grid-gap: 6px;
        }

        .not_found_wrap .btn_group .button {
            width: 180px;
            height: 46px;
            font-size: 18px;
            font-weight: 600;
            letter-spacing: -0.06em;
        }

        .linear_sky_blue {
            border: 1px solid #27a6ff;
            color: #27a6ff;
            background: transparent;
        }

        .full_blue {
            background: #27a6ff;
            color: #fff;
            border: 1px solid #27a6ff;
        }

        button {
            outline: 0 none;
            font: inherit;
            border-radius: 4px;
            cursor: pointer;
            background: transparent;
        }

    </style>
    <script type="text/javascript">
        function goBackHistory() {
            window.history.back();
        }

        function goFrontMain() {
            window.location.replace("https://invest.ibkbox.net/main");
        }
    </script>
</head>
<body>
<div class="not_found_wrap">
    <div class="not_found_container">
        <h3 class="not_found_title">404</h3>
        <div class="not_found_main_text">
            <p class='p01'>현재 페이지를 찾을 수 없습니다!</p>
            <p class='p02'>(404 Not found)</p>
        </div>
        <div class="not_found_sub_text">
            페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다. <br/>
            입력하신 주소가 정확한지 다시 한번 확인해 주시기 바랍니다.
        </div>
        <div class="btn_group">
            <Button class='button linear_sky_blue' onclick="goBackHistory()">이전 페이지로 이동</Button>
            <Button class='button full_blue' onclick="goFrontMain()">메인 페이지로 이동</Button>
        </div>
    </div>
</div>
</body>
</html>