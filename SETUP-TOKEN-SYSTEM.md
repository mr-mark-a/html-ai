# Token System Setup Guide

## Overview
The git-bot.html now uses a **token-based economy system** integrated with the render server from explo-cats.

## Key Features

### 🎯 Token System
- **Starting Tokens**: 100 per user
- **AI Question Cost**: 5 tokens per question
- **Token Display**: Shown in top-left corner of sidebar
- **Storage**: LocalStorage (with server sync via Socket.io)

### ⭐ Upgrades (Token-Based)
Each upgrade costs tokens instead of simulated money:

| Upgrade | Cost | Feature |
|---------|------|---------|
| 🚀 Premium AI | 50 | Advanced code generation with context awareness |
| 📦 Template Pack | 30 | 20+ professional website templates |
| 🎨 Advanced Styling | 25 | Animations, gradients, CSS features |
| ⚡ Fast Mode | 20 | Instant AI responses |
| 💾 Cloud Storage | 40 | Unlimited project saves |
| 📊 Analytics | 35 | Project statistics & insights |
| 🎯 Token Bundle | FREE | +50 bonus tokens (claim once) |

### 🔧 How It Works

1. **Open git-bot.html** in browser
2. **View Tokens**: Check balance in top-left sidebar
3. **Ask AI**: Each question costs 5 tokens
   - Will show error if insufficient tokens
   - Tokens deducted in real-time
4. **Upgrade**: Click "⭐ Upgrades" button
   - Browse available features
   - Click "Purchase" to buy (if tokens available)
   - Tokens deducted immediately

### 🖥️ Server Setup (Optional)

To use server sync instead of local-only storage:

```bash
cd d:\marks shortcuts\SOFT\html-ai\explo-cats\server
npm install
npm start
```

Server will run on `http://localhost:3000`

**Backend Events:**
- `get_tokens` - Retrieve user token balance
- `update_tokens` - Update token count
- `use_ai` - Deduct 5 tokens for AI question
- `purchase_upgrade` - Deduct tokens for upgrade
- `add_bonus_tokens` - Grant bonus tokens

### 📝 LocalStorage Usage

Tokens stored in browser with keys:
- `userTokens` - Current token balance (number)
- `purchasedFeatures` - Bought features JSON
- `webBuilderCode` - Saved editor code
- `webBuilderVisited` - First visit flag
- `AIBuiltProjects` - Saved projects

### 🎮 Game Integration

The backend also supports the original Exploding Kittens game from explo-cats folder. Token system is independent but runs on same server.

### 🔑 Token Earning

Currently: Users start with 100 tokens. Future plans:
- Daily login bonuses
- Referral system
- Completing tutorials
- Social sharing

### 🚀 Future Enhancements

- [ ] Real database persistence
- [ ] Leaderboards by tokens
- [ ] Token marketplace
- [ ] Achievements for token bonuses
- [ ] Admin token management panel
- [ ] Payment integration (actual purchases)

### 🐛 Troubleshooting

**Tokens reset on refresh?**
- Using localStorage - tokens persist
- Check browser storage settings

**Server connection failing?**
- App works offline with localStorage
- Optional server for multiplayer sync
- Check Port 3000 availability

**Can't purchase upgrade?**
- Check token balance in sidebar
- Each upgrade needs specific tokens
- Use bundle claim to get +50 free tokens

---

**Created**: March 14, 2026
**Status**: Active & Production Ready
