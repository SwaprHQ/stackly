import { ButtonHTMLAttributes } from 'react';
import styled from 'styled-components';

export const ShadowButtonText = styled.div`
  position: relative;
  z-index: 1;
  padding: 12px 36px;
  border-radius: 4px;
  background-color: #000;
  color: #fff;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
`;

export const ShadowButtonShadow = styled.div`
  transition: -webkit-transform 200ms ease-in-out;
  transition: transform 200ms ease-in-out;
  transition: transform 200ms ease-in-out, -webkit-transform 200ms ease-in-out;
  position: absolute;
  left: 0%;
  top: 0%;
  right: 0%;
  bottom: 0%;
  width: 100%;
  height: 100%;
  border: 2px solid #000;
  border-radius: 4px;
  background-color: #ff90e8;
`;

/**
 * From Gumroad, I hope Sahil doesn't mind me using this
 */
export const CreateDCAButton = styled.button`
  background-color: #000;
  color: #fff;
  border: none;
  padding: 0;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  position: relative;
  font-size: 18px;
  font-weight: bold;
  transition: -webkit-transform 200ms ease-in-out;
  transition: transform 200ms ease-in-out;
  transition: transform 200ms ease-in-out, -webkit-transform 200ms ease-in-out;
  & .shadow-button-text,
  & ${ShadowButtonText} {
    position: relative;
    z-index: 1;
    padding: 12px 36px;
    border-radius: 4px;
    background-color: #000;
    color: #fff;
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
  }

  & .shadow-button-shadow,
  & ${ShadowButtonShadow} {
    transition: -webkit-transform 200ms ease-in-out;
    transition: transform 200ms ease-in-out;
    transition: transform 200ms ease-in-out, -webkit-transform 200ms ease-in-out;
    position: absolute;
    left: 0%;
    top: 0%;
    right: 0%;
    bottom: 0%;
    width: 100%;
    height: 100%;
    border: 2px solid #000;
    border-radius: 4px;
    background-color: #ff90e8;
    &._2 {
      background-color: #f1f333;
      transform: translate3d(0rem, 0rem, 0px);
      transform-style: preserve-3d;
    }
  }

  &:hover {
    transform: translate3d(-0.5rem, -0.5rem, 0px);
    transform-style: preserve-3d;

    & .shadow-button-shadow {
      transform: translate3d(0.5rem, 0.5rem, 0px);
      transform-style: preserve-3d;
    }

    & .shadow-button-shadow._2 {
      transform: translate3d(1rem, 1rem, 0px);
      transform-style: preserve-3d;
    }
  }
`;

export function ShadowButton({
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <CreateDCAButton {...props}>
      <div className="shadow-button-text">{children}</div>
      <div className="shadow-button-shadow _2"></div>
      <div className="shadow-button-shadow"></div>
    </CreateDCAButton>
  );
}
