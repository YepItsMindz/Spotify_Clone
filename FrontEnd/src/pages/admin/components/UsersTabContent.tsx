import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UsersTable from "./UsersTable"
import { User2 } from "lucide-react";

const SongsTabContent = () => {
	return (
		<Card className="bg-gray-800/40 border-zinc-700/50">
			<CardHeader>
				<div className='flex items-center justify-between'>
					<div>
						<CardTitle className='flex items-center gap-2'>
							<User2 className='size-5 text-orange-500' />
							Users List
						</CardTitle>
						<CardDescription>Manage users</CardDescription>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<UsersTable />
			</CardContent>
		</Card>
	);
};
export default SongsTabContent;
