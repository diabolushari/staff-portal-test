export default function Field({ label, value }: { label: string; value: any }) {
	return (
		<div className="space-y-1">
			<label className="text-sm font-normal text-[#252c32]">{label}</label>
			<div className="rounded bg-gray-50 px-2.5 py-2.5 text-sm font-medium text-black">
				{value ?? "-"}
			</div>
		</div>
	);
}