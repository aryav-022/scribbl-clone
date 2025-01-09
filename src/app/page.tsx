import LoginForm from "@/components/LoginForm";

export default function Home() {
	return (
		<div className='flex flex-col h-screen items-center justify-center'>
			<h1 className='text-3xl font-bold absolute top-8'>Skribbl Clone</h1>
			<LoginForm />
		</div>
	);
}
