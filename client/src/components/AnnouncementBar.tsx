import { motion } from "framer-motion";

export default function AnnouncementBar() {
	return (
		<motion.div
			initial={{ opacity: 0, y: -50 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -50 }}
			className="bg-[#5DAD8C] pt-3 pb-[2.5rem] shrink-0"
			aria-hidden
		/>
	);
}
