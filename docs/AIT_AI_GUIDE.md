# 앱인토스 AI 개발 가이드

AI가 프로젝트 문맥을 이해하면 더 정확한 코드와 답변을 제공할 수 있습니다.  
Cursor에서는 **문서 URL** 또는 **MCP 서버**를 사용해 앱인토스 컨텍스트를 AI에게 전달할 수 있습니다.

**참고**: [앱인토스 AI 개발 가이드](https://developers-apps-in-toss.toss.im/development/llms.md)

---

## 1. MCP(Model Context Protocol) 서버 사용하기

MCP를 사용하면 AI가 앱인토스 SDK 문서, API 스펙, 설정을 자동으로 참조해 인앱 광고·결제·딥링크 등을 더 정확하게 구현할 수 있습니다.

### 설치

- **macOS**: `brew tap toss/tap && brew install ax`
- **Windows**: `scoop bucket add toss https://github.com/toss/scoop-bucket.git` 후 `scoop install ax`

### Cursor 연결

이 프로젝트에는 **`.cursor/mcp.json`** 에 앱인토스 MCP 서버 설정이 포함되어 있습니다.  
버튼으로 연결이 안 되면 해당 파일을 확인하세요.

```json
{
  "mcpServers": {
    "apps-in-toss": {
      "command": "ax",
      "args": ["mcp", "start"]
    }
  }
}
```

### Claude Code에서 사용 시

```bash
claude mcp add --transport stdio apps-in-toss ax mcp start
```

---

## 2. 문서 URL 등록하기 (@docs)

Cursor **설정 → Indexing & Docs → Docs** 에서 아래 URL을 추가하면, AI가 앱인토스 문서를 참고해 답변할 수 있습니다.

| 유형 | 설명 | URL |
|------|------|-----|
| **기본 문서 (권장)** | 핵심 정보 포함 | `https://developers-apps-in-toss.toss.im/llms.txt` |
| **전체 문서 (Full)** | 전체 기능 포함, 토큰 소모 증가 | `https://developers-apps-in-toss.toss.im/llms-full.txt` |
| **예제 전용** | 예제 코드 참고용 | `https://developers-apps-in-toss.toss.im/tutorials/examples.md` |
| **TDS WebView** | 이 프로젝트(WebView) 관련 | `https://tossmini-docs.toss.im/tds-mobile/llms-full.txt` |
| **TDS React Native** | React Native용 | `https://tossmini-docs.toss.im/tds-react-native/llms-full.txt` |

이 프로젝트는 **WebView** 미니앱이므로 **기본 문서** + **TDS WebView** URL 등록을 권장합니다.

---

## 3. @docs로 AI 활용하기

문서를 등록한 뒤, Cursor에서 **`@docs`** 를 사용해 해당 문서를 우선 참고하도록 요청할 수 있습니다.

**예시**

```
@docs 앱인토스 인앱광고 샘플 코드 작성해줘
```

**@docs 사용을 권장하는 경우**

- SDK·API처럼 **정확한 규칙 기반 코드**가 필요할 때
- 문서 의존도가 큰 기능을 구현할 때
- “문서 기준으로 답변해 달라”고 명시하고 싶을 때

---

## 요약

| 방법 | 용도 |
|------|------|
| **MCP (ax)** | 앱인토스 SDK·API·설정을 구조적으로 전달, 깊은 통합 |
| **Docs URL 등록** | llms.txt·TDS 문서를 Cursor 인덱싱에 포함 |
| **@docs** | 답변 시 지정한 문서를 우선 참고하도록 지시 |
