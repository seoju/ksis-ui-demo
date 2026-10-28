# CLAUDE.md 가 없을 때 : 새로 만들 파일 초안

`D:\test\CLAUDE.md` 로 아래 "새 파일 내용" 을 그대로 만듭니다.
맨 위 "이 프로그램" 단락은 Claude Code 가 코드를 보고 채운 뒤 사용자에게 확인받습니다.

## 새 파일 내용

```markdown
# KSIS-B

## 이 프로그램
- KSIS-B 영업정보시스템. C# Blazor(직접 개발). 공통 CSS 는 wwwroot/app.css, App.razor 에서 전체 적용.
- (Claude Code 가 채움: 실행 방법, 주요 폴더, 화면 파일 위치. 확인받은 뒤 적는다)

## 작업 규칙
- 답과 커밋 메시지는 한글로 쓴다.
- README.md 는 고치지 않는다.
- 커밋 · push 는 사용자가 하라고 할 때만 한다.

## KSIS UI 통일 작업

KSIS-A·B 디자인 통일에 맞춰 이 프로그램(KSIS-B) 화면을 시연 프로그램의 "④ B 요구사항" 모양으로 단계별로 바꾸는 중이다.
- 참고 자료: D:\ksis-ui-demo (github.com/seoju/ksis-ui-demo main). 읽기만 하고 고치지 않는다.
  - 지시서: D:\ksis-ui-demo\docs\ksis-b-guide\ (00-start → 01 → 02 → 03 → 04 순서)
  - 값의 기준: src\main\webapp\ksis-ui\css\ksis-theme-b.css(B 색), ksis-common.css(공통 모양), src\main\resources\requirements.json(요구사항 글, bNote = B 메모). 지시서와 다르면 이 파일들이 맞다.
- 한 번에 한 단계만 한다. 단계 끝의 "여기서 멈추고 확인받기"에서 반드시 멈추고, 바꾼 파일과 확인할 화면을 알려 준다.
- 화면 모양만 바꾼다. 데이터 조회·저장·권한 같은 동작 코드는 지시서가 시킬 때만, 먼저 범위를 알리고 허락받은 뒤 고친다.
- 색을 한꺼번에 바꾸기(같은 #FFFFFF 일괄 치환 등) 금지. 쓰임새를 보고 한 곳씩 바꾼다.
- 지시서에 없는 버튼 종류·화면이 나오면 마음대로 정하지 말고 묻는다.
```
