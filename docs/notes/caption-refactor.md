# ShouldLimitWidth

Should it be a part of Caption component?

## Usage

### Caption Component itself

[shouldLimitWidth passed in as prop with default prop of `false`](https://github.com/guardian/dotcom-rendering/blob/75b2596e603e6b36adec6fc8dfc38cc8c2eaecbe/src/web/components/Caption.tsx#L131)

If `Design.PhotoEssay` [applies two styles](https://github.com/guardian/dotcom-rendering/blob/75b2596e603e6b36adec6fc8dfc38cc8c2eaecbe/src/web/components/Caption.tsx#L158-L159):

```tsx
shouldLimitWidth && veryLimitedWidth,
shouldLimitWidth && bigLeftMargin,
```

Default of

```tsx
shouldLimitWidth && limitedWidth
```

### CaptionBlockComponent

Passes `shouldLimitWidth` through to `<Caption>` component. It is renderderd from `CaptionBlockElement` which is added from [enhance-photoessay](https://github.com/guardian/dotcom-rendering/blob/65acdc505bd20781c07581eb900b42c16965376b/src/model/enhance-photoessay.ts#L166) but doesn't seem to add this field. Does it need to be on the model of `CaptionBlockElement`?

### ImageComponent, YoutubeBlockComponent

Limit Caption width when:

- Not main media image
- Where role is showcase, supporting or immersive

```tsx
const shouldLimitWidth =
		!isMainMedia &&
		(role === 'showcase' || role === 'supporting' || role === 'immersive');
```

This is likely what we expect to add for `interactiveBlockComponent`. 

### ImmersiveLayout

Uses `<Caption>` for the Main Media with `shouldLimitWidth` true *above* leftCol

```tsx
const LeftColCaption = () => (
		<div
			className={css`
				margin-top: ${HEADLINE_OFFSET}px;
				position: absolute;
				margin-left: 20px;
			`}
		>
			<Caption
				...
        captionText={decideCaption(mainMedia)}
				shouldLimitWidth={true}
			/>
		</div>
	);
```

```tsx
<ContainerLayout
...
leftContent={<LeftColCaption />}
>
```

```tsx
const decideCaption = (mainMedia: ImageBlockElement): string => {
	const caption = [];
	if (mainMedia && mainMedia.data && mainMedia.data.caption)
		caption.push(mainMedia.data.caption);
	if (
		mainMedia &&
		mainMedia.displayCredit &&
		mainMedia.data &&
		mainMedia.data.credit
	)
		caption.push(mainMedia.data.credit);
	return caption.join(' ');
};
```

![image-20210409123929347](https://user-images.githubusercontent.com/638051/114175868-619c9b80-9932-11eb-9ce8-e8a20bb5ad07.png)



Below leftCol, caption is below and not limited:

![image-20210409124123593](https://user-images.githubusercontent.com/638051/114175851-5d707e00-9932-11eb-940e-c9a9a0574dc9.png)


### MultiImageBlockComponent

Never limit caption width

## Changes

### Default

Make limit caption width optional and make the default the same as as ImageComponent, YoutubeBlockComponent:

- Not main media image
- Where role is showcase, supporting or immersive

```tsx
const shouldLimitWidth =
		!isMainMedia &&
		(role === 'showcase' || role === 'supporting' || role === 'immersive');
```

 Other cases can specfically override as above.

### Property on the block element type

Remove the `shouldLimitWidth` from the `CaptionBlockElement` interface as it's not used when we create `CaptionBlockElement` in enhance-photoessay?

