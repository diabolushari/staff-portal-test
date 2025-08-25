import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import Heading from "@/typography/Heading";

interface Party {
	version_id: number;
	party_id: number;
	party_code: number | string;
	party_legacy_code?: string | null;
	name: string;
	party_type_id: number;
	party_type?: { id: number; parameter_value: string } | null;
	status_id: number;
	status?: { id: number; parameter_value: string } | null;
	effective_start: string;
	effective_end?: string | null;
	is_current: boolean;
	created_by: number;
	updated_by: number;
	created_at: string;
	updated_at: string | null;
	mobile_number?: number | string | null;
	telephone_number?: number | string | null;
	email_address?: string | null;
	address?: string | null;
	fax_number?: number | string | null;
}

interface Props {
	party: Party;
}

// Hash-based color for avatar bg for consistency
const hashColor = (str: string) => {
	let hash = 0;
	for (let i = 0; i < str.length; i++)
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	const hue = Math.abs(hash) % 360;
	return `hsl(${hue} 85% 45%)`;
};

const getInitials = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 3);

const fmtLocal = (iso?: string | null) => {
	if (!iso) return "-";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "-";
	return d.toLocaleString(); // local time/date
};

const fmtDate = (iso?: string | null) => {
	if (!iso) return "-";
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "-";
	return d.toLocaleDateString();
};

const safe = (v: unknown, fallback = "-") =>
	v === null || v === undefined || v === "" ? fallback : String(v);

const StatusBadge = ({ text }: { text: string }) => {
	const s = text.toLowerCase();
	const tone = s.includes("active")
		? "green"
		: s.includes("blacklist") || s.includes("inactive")
			? "red"
			: "slate";
	const map: Record<string, string> = {
		green: "bg-green-50 text-green-700 ring-green-200",
		red: "bg-red-50 text-red-700 ring-red-200",
		slate: "bg-slate-50 text-slate-700 ring-slate-200",
	};
	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${map[tone]}`}
		>
			{text}
		</span>
	);
};

const Pill = ({
	ok,
	trueText = "Current",
	falseText = "Archived",
}: {
	ok: boolean;
	trueText?: string;
	falseText?: string;
}) => {
	return ok ? (
		<span className="inline-flex items-center gap-1 text-green-700">
			<span className="h-2 w-2 rounded-full bg-green-500" />
			{trueText}
		</span>
	) : (
		<span className="inline-flex items-center gap-1 text-slate-600">
			<span className="h-2 w-2 rounded-full bg-slate-400" />
			{falseText}
		</span>
	);
};

export default function PartiesShow({ party }: Props) {
	const statusText =
		party?.status?.parameter_value ??
		(party.status_id === 1 ? "Active" : "Inactive");
	const typeText =
		party?.party_type?.parameter_value ??
		(party.party_type_id === 1 ? "Individual" : "Company");
	const avatarBg = hashColor(party?.name ?? "P");

	const onEdit = () => router.visit(route("parties.edit", party.version_id));
	const onBack = () => router.visit(route("parties.index"));

	return (
		<AppLayout>
			<div className="p-6">
				<div className="mb-4 flex items-center justify-between">
					<Heading>Party Details</Heading>
					<div className="flex items-center gap-2">
						<button
							onClick={onBack}
							className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
						>
							Back
						</button>
						<button
							onClick={onEdit}
							className="rounded-md bg-slate-800 px-3 py-2 text-sm text-white hover:bg-slate-900"
						>
							Edit Profile
						</button>
					</div>
				</div>

				{/* Header */}
				<div className="mb-6 flex flex-col justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center">
					<div className="flex items-center gap-4">
						<div
							className="flex h-16 w-16 select-none items-center justify-center rounded-full text-2xl font-semibold text-white shadow"
							style={{ background: avatarBg }}
							aria-hidden
						>
							{getInitials(party.name)}
						</div>
						<div>
							<div className="flex flex-wrap items-center gap-2">
								<div className="text-xl font-semibold capitalize">
									{safe(party.name)}
								</div>
								<StatusBadge text={statusText} />
								<Pill ok={party.is_current} />
							</div>
							<div className="text-sm text-slate-600">
								Party ID: <span className="font-medium">{party.party_id}</span>
							</div>
							<div className="text-sm text-slate-600">
								Connected:{" "}
								<span
									className="font-medium"
									title={`UTC: ${safe(party.effective_start)}`}
								>
									{fmtLocal(party.effective_start)}
								</span>
							</div>
						</div>
					</div>
					<div className="grid grid-cols-2 gap-2 text-sm text-slate-700 sm:text-right">
						<div className="text-slate-500">Party Code</div>
						<div className="font-medium">{safe(party.party_code)}</div>
						<div className="text-slate-500">Type</div>
						<div className="font-medium">{typeText}</div>
					</div>
				</div>

				{/* Quick Summary Cards */}
				<div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
					<div className="rounded-lg border border-slate-200 bg-white p-4">
						<div className="text-xs uppercase tracking-wide text-slate-500">
							Legacy Code
						</div>
						<div className="mt-1 text-lg font-semibold">
							{safe(party.party_legacy_code)}
						</div>
					</div>
					<div className="rounded-lg border border-slate-200 bg-white p-4">
						<div className="text-xs uppercase tracking-wide text-slate-500">
							Effective Start
						</div>
						<div
							className="mt-1 text-lg font-semibold"
							title={safe(party.effective_start)}
						>
							{fmtLocal(party.effective_start)}
						</div>
					</div>
					<div className="rounded-lg border border-slate-200 bg-white p-4">
						<div className="text-xs uppercase tracking-wide text-slate-500">
							Effective End
						</div>
						<div
							className="mt-1 text-lg font-semibold"
							title={safe(party.effective_end)}
						>
							{party.effective_end ? fmtLocal(party.effective_end) : "Ongoing"}
						</div>
					</div>
				</div>

				{/* Contact & Address */}
				<div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
					<div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
						<div className="mb-2 font-semibold text-slate-800">Contact</div>
						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="flex items-center gap-2">
								<span className="text-slate-500">Email</span>
								<span className="font-medium">{safe(party.email_address)}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-slate-500">Mobile</span>
								<span className="font-medium">{safe(party.mobile_number)}</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-slate-500">Telephone</span>
								<span className="font-medium">
									{safe(party.telephone_number)}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<span className="text-slate-500">Fax</span>
								<span className="font-medium">{safe(party.fax_number)}</span>
							</div>
						</div>
					</div>
					<div className="rounded-lg border border-slate-200 bg-white p-4">
						<div className="mb-2 font-semibold text-slate-800">Address</div>
						<div className="whitespace-pre-wrap text-slate-700">
							{safe(party.address)}
						</div>
					</div>
				</div>

				{/* Metadata */}
				<div className="rounded-lg border border-slate-200 bg-white p-4">
					<div className="mb-2 font-semibold text-slate-800">Metadata</div>
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
						<div className="text-sm">
							<div className="text-slate-500">Version</div>
							<div className="font-medium">{party.version_id}</div>
						</div>
						<div className="text-sm">
							<div className="text-slate-500">Created By</div>
							<div className="font-medium">{safe(party.created_by)}</div>
						</div>
						<div className="text-sm">
							<div className="text-slate-500">Updated By</div>
							<div className="font-medium">{safe(party.updated_by)}</div>
						</div>
						<div className="text-sm">
							<div className="text-slate-500">Created At</div>
							<div className="font-medium" title={safe(party.created_at)}>
								{fmtLocal(party.created_at)}
							</div>
						</div>
						<div className="text-sm">
							<div className="text-slate-500">Updated At</div>
							<div className="font-medium" title={safe(party.updated_at)}>
								{party.updated_at ? fmtLocal(party.updated_at) : "-"}
							</div>
						</div>
						<div className="text-sm">
							<div className="text-slate-500">Status</div>
							<div className="font-medium">{statusText}</div>
						</div>
					</div>
				</div>
			</div>
		</AppLayout>
	);
}
