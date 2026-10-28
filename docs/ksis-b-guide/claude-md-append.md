# CLAUDE.md 가 이미 있을 때 : 맨 끝에 붙일 단락

기존 내용은 그대로 두고, 아래 "붙일 내용" 만 파일 **맨 끝**에 한 번 덧붙입니다.
이미 `## KSIS UI 통일 작업` 제목이 있으면 붙이지 않습니다.

## 붙일 내용

```markdown

## KSIS UI 통일 작업

KSIS-A·B 디자인 통일에 맞춰 이 프로그램(KSIS-B) 화면을 시연 프로그램의 "④ B 요구사항" 모양으로 단계별로 바꾸는 중이다.
- 참고 자료: D:\ksis-ui-demo (github.com/seoju/ksis-ui-demo main). 읽기만 하고 고치지 않는다.
  - 지시서: D:\ksis-ui-demo\docs\ksis-b-guide\ (00-start → 01 → 02 → 03 → 04 순서)
  - 값의 기준: src\main\webapp\ksis-ui\css\ksis-theme-b.css(B 색), ksis-common.css(공통 모양), src\main\resources\requirements.json(요구사항 글, bNote = B 메모). 지시서와 다르면 이 파일들이 맞다.
- 한 번에 한 단계만 한다. 단계 끝의 "여기서 멈추고 확인받기"에서 반드시 멈추고, 바꾼 파일과 확인할 화면을 알려 준다.
- 화면 모양만 바꾼다. 데이터 조회·저장·권한 같은 동작 코드는 지시서가 시킬 때만, 먼저 범위를 알리고 허락받은 뒤 고친다.
- 색을 한꺼번에 바꾸기(같은 #FFFFFF 일괄 치환 등) 금지. 쓰임새를 보고 한 곳씩 바꾼다.
- 지시서에 없는 버튼 종류·화면이 나오면 마음대로 정하지 말고 묻는다.
- README.md 는 고치지 않는다. 답과 커밋 메시지는 한글로 쓴다.
```
