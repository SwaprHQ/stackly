import { Currency, WrappedTokenInfo } from 'dca-sdk';
import styled from 'styled-components';

export function TokenTags({ currency }: { currency: Currency }) {
  if (!(currency instanceof WrappedTokenInfo)) {
    return null;
  }

  const tags = currency.tags;
  if (!tags || tags.length === 0) return <span />;

  const tag = tags[0];

  return (
    <TagContainer>
      <div>
        <Tag key={tag.id}>{tag.name}</Tag>
      </div>
      {/* {tags.length > 1 ? (
        <MouseoverTooltip
          text={tags
            .slice(1)
            .map(({ name, description }) => `${name}: ${description}`)
            .join('; \n')}
        >
          <Tag>...</Tag>
        </MouseoverTooltip>
      ) : null} */}
    </TagContainer>
  );
}

const TagContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Tag = styled.div`
  background-color: #fff;
  color: #000;
  font-size: 14px;
  border-radius: 4px;
  padding: 0.25rem 0.3rem 0.25rem 0.3rem;
  max-width: 6rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  justify-self: flex-end;
  margin-right: 4px;
`;
