import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useChatStore } from "@/stores/useChatStore";
import { useEffect } from "react";

const AlbumsTable = () => {
	const { users, fetchUsers } = useChatStore();

	useEffect(() => {
		fetchUsers();
  }, [fetchUsers]);

	return (
		<Table>
			<TableHeader>
				<TableRow className='hover:bg-zinc-800'>
					<TableHead className='w-[50px]'></TableHead>
					<TableHead>ClerkId</TableHead>
					<TableHead>FullName</TableHead>
          <TableHead>Created At</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{users.map((user) => (
					<TableRow key={user._id} className='hover:bg-zinc-800'>
						<TableCell>
							<img src={user.imageUrl} alt={user.fullName} className='w-10 h-10 rounded-full' />
						</TableCell>
						<TableCell className='font-medium'>{user.clerkId}</TableCell>
						<TableCell>{user.fullName}</TableCell>
            <TableCell>{user.createdAt.split("T")[0]}</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
};
export default AlbumsTable;
