interface AnimateProps {
	children: React.ReactNode;
	animateOn: any;
}

export default function Animate({ children, animateOn }: AnimateProps) {
	return <div key={animateOn}>{children}</div>;
}
