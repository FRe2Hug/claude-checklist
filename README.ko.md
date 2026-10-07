# claude-checklist — Claude Code 체크리스트 플러그인

**만들기 전에 먼저 묻는다.** Claude 체크리스트 스킬. 새 작업을 시작하기 전에 Claude 가 여러 라운드 문답으로 방향을 합의하고,
그 합의를 BRIEF 로 남기고, 끝날 때 BRIEF 와 대조하게 하는 Claude Code 플러그인입니다.

[English](README.md)

![claude-checklist 데모: 추천 답이 붙은 질문, BRIEF 저장, 완료 대조, 배운 점](assets/demo.svg)

## 하는 일

- **문답 체크리스트 (`/checklist`)** — 새 작업이면 작업 크기에 맞춰 1~4라운드 질문 (추천 답이 첫 선택지, "나머지는 추천대로" 도 가능) → *말씀하신 것* 과 *Claude 의 추측* 을
  나눈 요약 → 승인 → BRIEF 저장 → 작업 → 끝날 때 BRIEF 와 대조한 완료 표.
- **작업 크기 먼저 말하기** — 요청마다 "새 작업이라 문답부터" 인지 "이어서 하기·작은 수정" 인지 한 줄로 말해서,
  사용자가 뒤집을 수 있게 합니다.
- **사용자 언어로** — 스킬은 하나입니다. 질문·요약·BRIEF·학습 파일 모두 사용자가 쓰는 언어를 따릅니다.
- **사용자 규칙 학습** — 같은 교정을 두 번 하거나 "앞으로는 ~" 이라고 하면 한 줄 규칙으로 제안합니다.
  승인하면 `~/.claude/checklist/rules.md` 에 저장되고 매 세션 적용됩니다.
- **분야 학습** — 아는 분야가 아닌 작업이면, 방금 한 문답을 바탕으로 분야 질문 목록 초안을 보여줍니다.
  승인하면 `~/.claude/checklist/fields/<분야>.md` 로 저장되어 다음부터 쓰입니다.
- **놓친 것에서 배우기** — 완료 대조의 ⚠️·❌, 또는 "완료" 뒤에 요청한 수정이 그 분야의 다음 질문으로 제안됩니다:
  *"다음엔 미리 물을까요: …?"*. 쓸수록 체크리스트가 정확해집니다.
- **이어서 하기** — 진행 중인 BRIEF 가 있는 폴더에서 세션을 열면 그 BRIEF 위치를 알려줍니다.

승인 없이 저장하는 것은 없습니다.

## 왜 이걸 쓰나

| | 잘 맞는 곳 | 이 플러그인이 더하는 것 |
|---|---|---|
| **계획 모드** (기본 기능) | 코드 수정 전에 Claude 의 계획 검토 | 추천 답이 붙은 질문, *하기 싫은 것* 목록, 세션이 끝나도 남는 완료 대조 |
| **[superpowers](https://github.com/obra/superpowers)** brainstorming | 설계 → 계획 → TDD 로 이어지는 코딩 작업 전체 | 가벼운 스킬 하나, 코딩 밖 분야(3D·문서·디자인) |
| **[spec-kit](https://github.com/github/spec-kit)** | 저장소에 명세를 두는 명세 주도 개발 | 작업 크기에 맞춤(작은 일은 1라운드), BRIEF 는 저장소 밖에 |
| **CLAUDE.md** | 항상 적용되는 규칙 | 작업마다의 합의와 끝날 때 대조. 규칙은 손으로 쓰지 않고 교정에서 배움 |

이것만 하는 것: BRIEF 가 **폴더에 붙어** 다시 열면 돌아오고, **하기 싫은 것**을 완료 전에 한 줄씩 확인하고,
**놓친 것이 다음 질문**이 됩니다.

## 실제 모습

```
나:     사진 파일 이름을 날짜순으로 바꿔주는 작은 CLI 도구를 만들고 싶어.
Claude: 새 작업으로 보고 질문부터 드리겠습니다.
        미리 확인: ./photos-tool 은 비어 있고, Python 3.12 가 있고, exiftool 은 없습니다.

        1라운드 — 목표와 결과물
        1. 날짜는 어디서 가져올까요?
           > EXIF 촬영일, 없으면 파일 수정일 (추천)
             EXIF 만 · 수정일만
        2. 새 이름 형식은?
           > 2026-10-01_143052.jpg (추천) · 20261001_143052.jpg · 원래 이름 유지
        ...
```

라운드·요약·승인·완료 대조 표·규칙 학습까지 전체 흐름: [examples/session.md](examples/session.md) (영어).
저장되는 BRIEF: [examples/brief.md](examples/brief.md).

## 설치

필요: Claude Code, `node` (세션 시작 훅용, npm 패키지는 쓰지 않음)

```
claude plugin marketplace add FRe2Hug/claude-checklist
claude plugin install claude-checklist@claude-checklist
```

Claude Code 안에서는 `/plugin marketplace add FRe2Hug/claude-checklist` → `/plugin install claude-checklist@claude-checklist`.

새 세션을 열고 새 작업을 요청하거나 `/checklist <하려는 일>` 을 입력하세요.

**스킬만 쓰기 (플러그인 없이):** `plugin/skills/checklist/` 를 `~/.claude/skills/checklist/` 로 복사하고 `/checklist` 로 직접 부르세요.
세션 시작 훅이 없어서 작업 크기 자동 판단, 사용자 규칙, 진행 중 BRIEF 안내는 빠집니다.

**끄기:** `claude plugin disable claude-checklist@claude-checklist`

## 내 파일

가르친 내용은 플러그인 밖에 있어서 업데이트해도 지워지지 않습니다.

| 경로 | 내용 |
|---|---|
| `~/.claude/checklist/rules.md` | 내 규칙 (한 줄에 하나, 매 세션 적용). 직접 고쳐도 됩니다. |
| `~/.claude/checklist/fields/*.md` | 내 분야 질문 목록 (기본 분야보다 먼저 사용) |
| `~/.claude/checklist/briefs/*.md` | BRIEF. `status: done` (또는 `완료`) 으로 바꾸면 안내가 멈춥니다. |

다른 폴더를 쓰려면 `CHECKLIST_HOME` 환경 변수를 지정하세요.

## 기본 분야

`coding`, `docs`, `design`, `3d-modeling`, `3d-print` (`plugin/skills/checklist/fields/`). 같은 형식으로 직접 추가할 수도 있습니다.
예: `~/.claude/checklist/fields/data-analysis.md`

## 개발

세션 훅 테스트: `node --test test/session_start.test.js` (Node 18 이상, 의존성 없음)

## 참고

[obra/superpowers](https://github.com/obra/superpowers) brainstorming (승인 관문, 이해한 것 되짚기),
[mattpocock/skills](https://github.com/mattpocock/skills) grilling (결정 나무 라운드 질문, 추천 답).

## 라이선스

MIT
