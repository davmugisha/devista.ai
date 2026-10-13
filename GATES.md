# Gates: Saydeed site update for Goal 1

OWNS: app/**, components/**, lib/**, deploy/**, scripts/verify-*.mjs, package.json, PRODUCT.md, CLAUDE.md, GOAL.md

Scope: saydeed.com source says what Goal 1 sells (a 7 day Agent Team Setup for small agencies, US$1,500 for the first 3 founding clients, free call then paid upfront), contains no false or contradictory claim, has one brand, has demo and portfolio placeholders, builds, and serves every page. Nothing is committed or deployed until David approves.

- [x] G1: no banned words, no "autonomous", no "next hire", no "AI-powered" in site source
  CHECK: node scripts/verify-site.mjs banned
  EXPECT: banned check passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=56fbf3213c6cbd8e067aead6082443c95806cff4b4e33ec7c2f2b0d0f4115455; exit=0; EXPECT=matched; output-sha256=0cf1ba13ca1a3d41d1442d7adf063ffe08d248973f9d0191a347045a79efbb86; output-bytes=20; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\davidmugisha\Desktop\devista.ai\devista.ai; path=bff5ec0f3e69/23 entries

- [x] G2: the free audit and the established-company buyer are gone from site source
  CHECK: node scripts/verify-site.mjs offer
  EXPECT: offer check passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=259bd43114deef8849c88e59e04436cd154a94e6b2612b4aea21ab8fcccd8059; exit=0; EXPECT=matched; output-sha256=4533ee12b8d7772a7fe56fe252ea43a296e6b66cff3c7ef57a7191abaa0c3b41; output-bytes=19; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\davidmugisha\Desktop\devista.ai\devista.ai; path=bff5ec0f3e69/23 entries

- [x] G3: no Devista or Paperclip leftovers in source, deploy files or PRODUCT.md
  CHECK: node scripts/verify-site.mjs brand
  EXPECT: brand check passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=fe695663fac906421336a1fcc0df4fcbed8a2e87b462a1bbe4146414ae3ddb94; exit=0; EXPECT=matched; output-sha256=552f2835e125c4c6fb920086ca15491f6ccf8051a0b73c69b086120d5660d8b2; output-bytes=19; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\davidmugisha\Desktop\devista.ai\devista.ai; path=bff5ec0f3e69/23 entries

- [x] G4: no em or en dashes in site copy
  CHECK: node scripts/verify-site.mjs dashes
  EXPECT: dashes check passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=4538457e438608af1185774d8e1194e00bd307cb0328c2c5f99e41f48cc42824; exit=0; EXPECT=matched; output-sha256=50a8d525ab3db30cfe2bce7edc7486e3a2b315cd52d06d446685a427b36311ce; output-bytes=20; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\davidmugisha\Desktop\devista.ai\devista.ai; path=bff5ec0f3e69/23 entries

- [x] G5: no raw colours or arbitrary pixel values outside the token files
  CHECK: node scripts/verify-site.mjs tokens
  EXPECT: tokens check passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=a2b16acbdc5c11d7b8392dbe9c017c075b9eabbb5be6772f8efbbbba395cfd23; exit=0; EXPECT=matched; output-sha256=3ba50826ae474e23bdb417a022b9cb314275d4c1ffa2e23224e1c2c72d6d5a27; output-bytes=20; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\davidmugisha\Desktop\devista.ai\devista.ai; path=bff5ec0f3e69/23 entries

- [x] G6: the confirmed prices and the 7 day promise appear, and no invented proof or company type does
  CHECK: node scripts/verify-site.mjs facts
  EXPECT: facts check passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=50d6c42f77dac0f6af0903fc899ca38efc0bf7d422bee16d5fd2c48dca97db27; exit=0; EXPECT=matched; output-sha256=404d510abb6726eebce95ea0eb28105f4d3683065093bc0ed4badb85a315c7a2; output-bytes=19; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\davidmugisha\Desktop\devista.ai\devista.ai; path=bff5ec0f3e69/23 entries

- [x] G7: TypeScript passes
  CHECK: npm run typecheck && node -e "console.log('typecheck ok')"
  EXPECT: typecheck ok
  EVIDENCE: automatic-evidence=v1; definition-sha256=8e7b97658df7092af485d88fd4fbac5c85932dc8b5d412577f18da357243c18d; exit=0; EXPECT=matched; output-sha256=69a74f6766a3fa0d2ff25fc4c3259911af86a935c3584bb808abb95cc6c1168e; output-bytes=61; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\davidmugisha\Desktop\devista.ai\devista.ai; path=bff5ec0f3e69/23 entries

- [x] G8: the production build succeeds
  CHECK: npm run build && node -e "console.log('build ok')"
  EXPECT: build ok
  EVIDENCE: automatic-evidence=v1; definition-sha256=f86556a85bb962897d9801f4d09be89c0e617bd9c9a512bf85f4ffd09fbe9841; exit=0; EXPECT=matched; output-sha256=7004a0f89671dae92b0aa950cc55b450321e97bc8b61cde4ede2f495d3199d41; output-bytes=2700; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\davidmugisha\Desktop\devista.ai\devista.ai; path=bff5ec0f3e69/23 entries

- [x] G9: the built site serves every page with the new headline and prices, the booking API answers JSON, and a newsletter sign up writes a row
  CHECK: node scripts/verify-pages.mjs
  EXPECT: pages check passed
  EVIDENCE: automatic-evidence=v1; definition-sha256=a91ddd222b16d8d4a6563155dbadf1cfecf3db0e8e630d6aa1fed49ae62ce0ba; exit=0; EXPECT=matched; output-sha256=b7cdd2ae7d236fc13a54b25d2a587469cb74159d5e7d3e15c4e770ec1c7aaafb; output-bytes=19; shell=C:\WINDOWS\system32\cmd.exe; cwd=C:\Users\davidmugisha\Desktop\devista.ai\devista.ai; path=bff5ec0f3e69/23 entries

- [ ] G10: David has read the new homepage copy, pricing, FAQ and booking text and approved or corrected it
  EVIDENCE: pending

<!--
Negative controls: G1 to G6 were run against the old code before any change and failed with the
expected hits (banned: 2, offer: 59, brand: 20, dashes: 1, facts: 6). G5 passed on old code, so its
control is a planted raw colour tested before G5 is accepted.
Deploy, commit and the live booking test are NOT gates: they need David's approval.
-->
