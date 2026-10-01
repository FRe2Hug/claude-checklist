# claude-checklist (문답) — Claude Code 체크리스트 플러그인

**만들기 전에 먼저 묻는다.** Claude 체크리스트 스킬. 새 작업을 시작하기 전에 Claude 가 여러 라운드 문답으로 방향을 합의하고,
그 합의를 BRIEF 로 남기고, 끝날 때 BRIEF 와 대조하게 하는 Claude Code 플러그인입니다.

[English](README.md)

## 하는 일

- **문답 체크리스트 (`/checklist`)** — 새 작업이면 추천 답이 붙은 질문 최소 3라운드 → *말씀하신 것* 과 *Claude 의 추측* 을
  나눈 요약 → 승인 → BRIEF 저장 → 작업 → 끝날 때 BRIEF 와 대조한 완료 표.
- **작업 크기 먼저 말하기** — 요청마다 "새 작업이라 문답부터" 인지 "이어서 하기·작은 수정" 인지 한 줄로 말해서,
  사용자가 뒤집을 수 있게 합니다.
- **사용자 언어로** — 스킬은 하나입니다. 질문·요약·BRIEF·학습 파일 모두 사용자가 쓰는 언어를 따릅니다.
- **사용자 규칙 학습** — 같은 교정을 두 번 하거나 "앞으로는 ~" 이라고 하면 한 줄 규칙으로 제안합니다.
  승인하면 `~/.claude/mundap/rules.md` 에 저장되고 매 세션 적용됩니다.
- **분야 학습** — 아는 분야가 아닌 작업이면, 방금 한 문답을 바탕으로 분야 질문 목록 초안을 보여줍니다.
  승인하면 `~/.claude/mundap/fields/<분야>.md` 로 저장되어 다음부터 쓰입니다.
- **이어서 하기** — 진행 중인 BRIEF 가 있는 폴더에서 세션을 열면 그 BRIEF 위치를 알려줍니다.

승인 없이 저장하는 것은 없습니다.

## 설치

필요: Claude Code, `node` (세션 시작 훅용, npm 패키지는 쓰지 않음)

```
claude plugin marketplace add FRe2Hug/claude-checklist
claude plugin install claude-checklist@claude-checklist
```

Claude Code 안에서는 `/plugin marketplace add FRe2Hug/claude-checklist` → `/plugin install claude-checklist@claude-checklist`.

새 세션을 열고 새 작업을 요청하거나 `/checklist <하려는 일>` 을 입력하세요.

## 내 파일

가르친 내용은 플러그인 밖에 있어서 업데이트해도 지워지지 않습니다.

| 경로 | 내용 |
|---|---|
| `~/.claude/mundap/rules.md` | 내 규칙 (한 줄에 하나, 매 세션 적용). 직접 고쳐도 됩니다. |
| `~/.claude/mundap/fields/*.md` | 내 분야 질문 목록 (기본 분야보다 먼저 사용) |
| `~/.claude/mundap/briefs/*.md` | BRIEF. `status: done` 으로 바꾸면 안내가 멈춥니다. |

다른 폴더를 쓰려면 `MUNDAP_HOME` 환경 변수를 지정하세요.

## 기본 분야

`coding`, `docs`, `design` (`plugin/skills/checklist/fields/`). 같은 형식으로 직접 추가할 수도 있습니다.
예: `~/.claude/mundap/fields/data-analysis.md`

## 참고

[obra/superpowers](https://github.com/obra/superpowers) brainstorming (승인 관문, 이해한 것 되짚기),
[mattpocock/skills](https://github.com/mattpocock/skills) grilling (결정 나무 라운드 질문, 추천 답).

## 라이선스

MIT
