import { useEffect, useContext, useState } from 'react'
import { ContextConfig } from '../context/ContextConfig';

const LogsDenuncia = () => {

    const { handleSession, HOST, HOST_AUTH } = useContext(ContextConfig)
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [paginationInfo, setPaginationInfo] = useState({ totalLogs: 0, totalPages: 0 });
    const [loading, setLoading] = useState(false);
	const [userFilter, setUserFilter] = useState('');
	const [actionFilter, setActionFilter] = useState('');

    const handlePrevPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(paginationInfo.totalPages, prev + 1));
    };
    
	useEffect(() => {
		const fetchLogs = async () => {
            setLoading(true);
			const params = new URLSearchParams({
				page: String(currentPage),
				pageSize: String(pageSize),
			});
			const uf = userFilter.trim();
			const af = actionFilter.trim();
			if (uf) { params.append('user', uf); params.append('usuario', uf); }
			if (af) { params.append('action', af); params.append('accion', af); }
			const url = `${HOST}/api/log?${params.toString()}`;

            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                if (!response.ok) {
                    console.error("Error al obtener logs:", response.statusText);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                //console.log(data)

                setLogs(data.logs || []);

                setPaginationInfo({
                    totalLogs: data.totalLogs,
                    totalPages: data.totalPages,
                });

                //console.log(`Logs de la página ${currentPage} cargados.`, data);

            } catch (err) {
                console.error("Error de red:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();

	}, [currentPage, pageSize, userFilter, actionFilter]);

	const formatDateTime = (value) => {
		if (!value) return '';
		try {
			const date = new Date(value);
			return new Intl.DateTimeFormat('es-AR', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
				timeZone: 'America/Argentina/Buenos_Aires',
			}).format(date).replace(',', '');
		} catch {
			return String(value);
		}
	};

    return (
		<div className='flex flex-col md:h-screen px-8 pt-8 overflow-y-hidden'>
			<h2 className='text-[#005CA2] font-bold text-2xl md:text-left text-center'>Logs</h2>

			<div className='mt-6 flex items-center justify-between gap-4'>
				<div className='text-sm text-gray-600'>
					{paginationInfo.totalLogs > 0 ? (
						<span>Total: {paginationInfo.totalLogs} registros</span>
					) : (
						<span>Sin registros</span>
					)}
				</div>
				<div className='flex flex-wrap items-center gap-2'>
					<input
						type='text'
						placeholder='Filtrar por usuario'
						className='border rounded px-2 py-1 text-sm'
						value={userFilter}
						onChange={(e) => {
							setCurrentPage(1);
							setUserFilter(e.target.value);
						}}
					/>
					<input
						type='text'
						placeholder='Filtrar por acción'
						className='border rounded px-2 py-1 text-sm'
						value={actionFilter}
						onChange={(e) => {
							setCurrentPage(1);
							setActionFilter(e.target.value);
						}}
					/>
					<button
						className='px-2 py-1 text-sm border rounded disabled:opacity-50'
						onClick={() => { setUserFilter(''); setActionFilter(''); setCurrentPage(1); }}
						disabled={loading || (!userFilter && !actionFilter)}
					>
						Limpiar filtros
					</button>
					<label htmlFor='pageSize' className='text-sm text-gray-700'>Filas por página:</label>
					<select
						id='pageSize'
						className='border rounded px-2 py-1 text-sm'
						value={pageSize}
						onChange={(e) => {
							setCurrentPage(1);
							setPageSize(Number(e.target.value));
						}}
						disabled={loading}
					>
						<option value={10}>10</option>
						<option value={20}>20</option>
						<option value={50}>50</option>
						<option value={100}>100</option>
					</select>
				</div>
			</div>

			<div className='mt-4 -mx-2 overflow-x-auto md:mx-0'>
				<div className='inline-block min-w-full align-middle'>
					<div className='overflow-hidden rounded border border-gray-200'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Fecha</th>
									<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Usuario</th>
									<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Acción</th>
									<th className='px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Descripción</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{loading ? (
									<tr>
										<td className='px-4 py-6 text-center text-sm text-gray-600' colSpan={4}>Cargando...</td>
									</tr>
								) : logs.length === 0 ? (
									<tr>
										<td className='px-4 py-6 text-center text-sm text-gray-600' colSpan={4}>No hay logs para mostrar</td>
									</tr>
								) : (
									logs.map((log, index) => (
										<tr key={log.id || index} className='hover:bg-gray-50'>
										<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900'>
											{formatDateTime(log.timestamp || log.fecha || log.createdAt)}
										</td>
											<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900'>
												{log.dniId || log.usuario || log.user || ''}
											</td>
											<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900'>
												{log.action || log.accion || log.event || ''}
											</td>
											<td className='px-4 py-2 whitespace-nowrap text-sm text-gray-900'>
												{log.descripcion || ''}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			<div className='my-4 flex items-center justify-between'>
				<div className='text-sm text-gray-700'>
					Página {currentPage} de {Math.max(1, paginationInfo.totalPages || 1)}
				</div>
				<div className='flex items-center gap-2'>
					<button
						onClick={() => { setCurrentPage(1); }}
						className='px-3 py-1 rounded border text-sm disabled:opacity-50'
						disabled={loading || currentPage === 1}
					>
						« Primero
					</button>
					<button
						onClick={handlePrevPage}
						className='px-3 py-1 rounded border text-sm disabled:opacity-50'
						disabled={loading || currentPage === 1}
					>
						‹ Anterior
					</button>
					<button
						onClick={handleNextPage}
						className='px-3 py-1 rounded border text-sm disabled:opacity-50'
						disabled={loading || currentPage >= (paginationInfo.totalPages || 1)}
					>
						Siguiente ›
					</button>
					<button
						onClick={() => { setCurrentPage(paginationInfo.totalPages || 1); }}
						className='px-3 py-1 rounded border text-sm disabled:opacity-50'
						disabled={loading || currentPage >= (paginationInfo.totalPages || 1)}
					>
						Último »
					</button>
				</div>
			</div>
		</div>
    )
}

export default LogsDenuncia