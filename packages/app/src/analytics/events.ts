export const DISCORD_BUTTON_CLICK = 'click/discord-button-link';

export const events: Record<string, string> = {
  [DISCORD_BUTTON_CLICK]: process.env.REACT_APP_DISCORD_BUTTON_CLICK_EVENT as string,
};
