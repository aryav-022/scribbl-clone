interface AnimateProps<T extends React.Key> {
	children: React.ReactNode;
	animateOn: T;
}

export default function Animate<T extends React.Key>({ children, animateOn }: AnimateProps<T>) {
	return <div key={animateOn}>{children}</div>;
}
