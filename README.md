 #  BunnyLetter?

<img src='https://ifh.cc/g/lTvx6Q.png' border='0'>

### 링크 
http://52.79.93.121:7000/ <br>
<p>아이디: root123, 비밀번호: root123</p>
<br>

-------

## 프로젝트 소개
<p>
2023 계묘년을 맞이해 주변 사람들에게 편지를 작성해 마음을 전달할 수 있는 소통의 장이 되는 사이트 <br>
- 편지를 작성하고 회원인 지인의 닉네임을 검색해 전송 가능 <br>
-  카카오톡 공유하기로 편지를 보냈다는 알림 전송 가능 <br>
</p>
 
<br>    
    

## 1. 제작 기간 & 참여 인원
2023/1/24 ~ 2023/2/4 (총 1주)
- 개발 인원: 프론트엔드 1명, 백엔드 1명 - 총 2명의 팀 프로젝트
- 맡은 역할: 백엔드 개발

<br>

## 2. 사용 기술
#### `Back-end`
  - NodeJS(Express)
  - Sequelize
#### `Front-end`
  - ReactJS
  - React-Redux
#### `Database`
  - MySQL
#### `DevOps`
  - AWS EC2

<br>

## 3. ERD 설계
<img src='https://ifh.cc/g/rXavqw.png' border='0'>

- user DB 
- letter DB
    
<br>

## 4. 구현 기능

### 4.1. 회원가입/로그인 및 로그아웃
- App.js에서 회원가입, 로그인을 통해 저장한 유저 세션값을 리덕스store user에 저장하고 관리하며, 상태에따라 네비게이션 바에 다른 버튼이 뜹니다.
- axios를 이용해 아이디, 닉네임 중복 검사를 합니다
- ID, 비밀번호는 숫자+ 영문 6~20자리 정규식을 사용하고 비밀번호는 DB에 암호화하여 저장합니다
- 비밀번호와 비밀번호 확인 입력값이 일치하는지 안하는지 메시지 알림을 줍니다.
-  nav바에 로그아웃을 누르면 store에 login 값이 false가 되도록 리덕스를 통해 상태를 관리합니다

### 4.2.닉네임 검색
- axios를 통해 존재하지 않는 닉네임이라면 정보가 없다는 알림창을 띄웁니다.
- 닉네임이 존재한다면 해당 유저에게 편지를 쓸 수 있습니다.
    
### 4.3. 편지 쓰기
- 편지는 200자로 제한했으며 쓰면서 실시간으로 몇글자를 썼는지 볼 수 있습니다.
- 편지 전송 버튼 클릭시 letter DB 저장되고 카카오톡 공유하기를 할 수 있습니다.
- 쓴 편지를 html2canvas를 통해서 캡쳐하고 toDataURL 함수를 이용해 이미지를 문자열 형태로 변환해 DB에 저장합니다.
    
### 4.4.마이페이지
- 회원정보는 비밀번호만 수정 가능합니다
- 새 비밀번호는 6-20 자리의 영문 숫자 조합 정규식을 사용해 수정 가능합니다.
- 탈퇴를 할 수 있습니다
- 내가 보낸 편지와 내가 받은 편지를 구분해서 이미지로 볼 수 있습니다
- 편지는 마이페이지에서 숨김 처리 가능하며 버튼 클릭시 한 번 더 경고창을 띄웁니다.

### 4.5 카카오톡 공유하기 API
- 카카오톡 공유하기를 통해 편지를 받았다는 메시지를 전달할 수 있습니다
- 템플릿을 이용해서 카카오톡에 보여질 이미지, 메시지, 주소를 설정하여 전달합니다.
    
<br>

## 5. 개발한 부분
- ERD 설계
- **사용자 관련 `RESTful API`구현**
    - RESTful API를 활용하여 사용자 정보 주고받는 데이터 통신 구현, `axios` 사용
    - `bcrypt`를 활용하여 비밀번호 암호화 구현
    - 회원 가입 시 아이디와 비밀번호는 숫자와 영문을 포함한 6~20자리의 정규식 설정

- **편지 이미지 캡쳐 및 이미지 데이터 DB 저장 구현**
    - `html2canvas` 라이브러리를 사용하여 유저가 쓴 편지 이미지 캡쳐
    - `toDataURL` 함수를 이용하여 이미지를 `base64` 형태로 변환하여 이미지 데이터를 서버로 전송

- **유저 정보를 `SessionStorage()`에 저장**
- **`React-Redux` 로 로그인한 사용자 정보 전역 관리**
    - 사용자가 로그인하면, 세션에 사용자 정보를 저장하는 동시에, 리덕스 스토어의 로그인 값을 `true`로 설정
    - 로그아웃하면, 세션에 저장된 정보를 삭제. 리덕스 스토어의 로그인 값을 `false` 로 설정
    - 모든 페이지에서 로그인 상태를 파악 가능 및 다른 컴포넌트에서도 쉽게 접근하여 사용 가능
    
- **`AWS EC2`를 이용하여 프로젝트 배포**

<br>

## 트러블 슈팅 및 개선사항

#### 이미지 데이터 관리
>- 캡쳐된 이미지는 blob 형식으로 넘어오는데, 이를 base 64로 인코딩하여 관리 중입니다.
>- 그러나 현재 저장하는 string 값이 너무 길기 떄문에 서버에 불필요하게 큰 용량이 저장된다는 단점이 있습니다.
>- 따라서 multer를 이용하거나 클라우드 스토리지 서비스를 이용하여 서버의 용량과 처리속도를 개선하는 방안이 필요합니다. 

#### 라이브러리 호환성 문제 & 이미지 캡쳐 문제 
>- 처음에는 dom-to-image 라이브러리를 사용하여 이미지를 캡쳐하고 저장하려고 하였습니다. 
>- 하지만 dom-to-image는 크롬 브라우저에서만 제대로 작동하도록 설계되어 있다는 점을 간과하였고, 이를 해결하기 위해 html2canvas 라이브러리를 사용하였습니다.
>- 그러나 html2canvas를 사용하였을 때 textarea가 한 줄 이상 캡쳐되지 않는 문제가 발생했습니다.
>- 이 문제는 `@nidi/html2canvas` 라이브러리를 사용해 해결하였으나, 캡쳐가 짤리는 문제가 발생하여 이는 window.scroll로 해결하였습니다.

<br>
<summary><b>이미지 캡쳐 상세 코드</b></summary>

```
...
import html2canvas from '@nidi/html2canvas';

const MakeBunny = () => {
  ...
  const onClickSend = () => {
    let letterContext = textAreaRef.current.value;

    let checkLen = checkLength();
    if (checkLen) {
      if (letterContext === '' || letterContext === undefined) {
        alert('편지 내용을 입력해주세요.');
      } else {
        //편지 내용 세션 저장
        sessionStorage.setItem('letter_context', letterContext);
        const card = bunnyCardRef.current;
        let scale = 2;
        window.scrollTo(0, 0);
        html2canvas(card, { backgroundColor: null, width: 380 }).then(
          (canvas) => {
            navigate('/shareKakao', {
              state: {
                blob: canvas.toDataURL('image/png'),
                receiver: receiver,
                letterContext: textAreaRef.current.value,
              },
            });
          }
        );
      }
    }
  };
```
</details>
