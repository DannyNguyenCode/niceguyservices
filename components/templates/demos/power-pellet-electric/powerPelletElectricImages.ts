export const PPE_IMG = {
  panelHero:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBlUaGcY7hQHhwFwp5OoQUG2cHZhQYwhqW_K_wbmclScmxS_Br18I8fG9AM-Yi4UcvTtCukeeRThrhKk7DyOykX-PhCjp3gNq6JJ_p-t8QEA0QtVsF04-vdJib3djfqwkyAnPCWvt_F7Oo0iKPOIEWZKNeY60wiPoVJGMcaK2a7-5i80OCaOCcXs15tNoBftmW8gpWfr22EbBHTHnAfIUDMmTeyvikuxRIUl7k0vx0fGYo3wCwVMfVlUQ",
  panelCloseup:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDMuOG2mcXsoBGWgWHzFbza0AWt-aspkQewDEAFqtlHzcxnDp9UMueCK4YVwpPA2yP9YxPydYxx9gubauVf_jRm2ASKDQxT1ot4DBHagVnT64SsG4a1wZWwlKoZK8EOowoHW-_p5PhCCXSZ1tqLVGGyM3KY3jGfvq2AwzilsVa6P5Mj4RLNvgr4jB898rz49455aqJbBP6-3VbBWH6A5iHuLzJoNEMvGXPE7tSi_Yv0Agg37RSOalgjiw",
  evCharger:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDbedQ44xHM-a-iwtL5JoBOzOSTBheGvHAp2bnNYe-VAFYUZl_dwMZ90ZB0TSdCCkohfew33JSAGvOnBpaHomrIcBRBU4koaj8iXd2OD4xElWmv8d43Dfkz_BiKS82SLnJDCl-oN6oZtGy5x9gnG8IYmVtrtGT0vgTrcmSebPLu5aK_el3dnpoZsEGYINr1pXGPcH9rnH5LzdmqCEahqWHY-JFvX0axusn2QceoxMtkZAtg-nvDYMljXA",
  diagnostic:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAGG3i9AzKFJ2QPwCdl5zlAZ2TIDCBUAYcs9AjJkIqVoCcHn1gkCKy1w4bBpo7y-hBbHHWkx5zN3jQ8q2jFGmiVz01tvki17BaRv4VjYntUag6jrALgvvppC2Q2jsSIiyi4WnJCLNthgX-hIyCG21rAtAxCBSU9ymxwLx2nIn1BUhc2RFiy9HyKVb3GA6B7KH9bUV1d3WCimDy_VNo1YVsZIGxSbNH00nmIWrY6jIIpvsSumbEEPVsJYw",
  lighting:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDpu9VKgHnAgicbOZvc0At9k4VPNi9t8umS6h_sBst2tgQsFwRFrWaq4NE_gA49sKzFHmmvTwpLYyTzK0FQZSeZi00J1lkltv8hoUOiwg73zTtK-ypqfis-kJ_8XUoMF2gNFmZ63QqoJoeyVKPNVnKAJG27eBhxNpCFySEny2Swuh6Of0AIxggq0t8XCRTgQBMmnKdjkqxkl4OF192J3WYPbkpdcb5cGTOOjZRPSoE6_P98hB2pveX7iw",
  servicesBento:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDurFffL2faH6hLJCkfvjbvUQi-O39DNSGYnogp_S-3CXN161KgbkCbLir3N22hVsIarl33niROl5nAOe6hfXHxpsK3b6ddfgv9GR0EwLe890b24XK5_oIEgNA1559QSezc3R_SoIer5tqi2SMp_MTGYwTHCB5SDtd2lnjft_9b1cv2tXE9z1Bh0_Q-Ph8buIuiNQARTwKQmsmi1HJ7kwOHzJzZdY2xNu5H01ROLH_Az-vGUKpoqT0_zw",
} as const;

export type PpeImageKey = keyof typeof PPE_IMG;

export function ppeImage(key: string): string {
  return PPE_IMG[key as PpeImageKey] ?? PPE_IMG.panelCloseup;
}

const PPE_SERVICE_HERO: Record<string, PpeImageKey> = {
  "residential-electrical-service": "diagnostic",
  "commercial-electrical-service": "servicesBento",
  "panel-upgrades": "panelHero",
  "breaker-circuit-troubleshooting": "diagnostic",
  "lighting-installation": "lighting",
  "ev-charger-installation-prep": "evCharger",
  "electrical-safety-inspections": "panelCloseup",
  "surge-protection": "panelHero",
  "wiring-rewiring": "panelCloseup",
  "emergency-electrical-support": "diagnostic",
};

export function ppeServiceHeroImage(slug: string): string {
  return PPE_IMG[PPE_SERVICE_HERO[slug] ?? "panelCloseup"];
}
