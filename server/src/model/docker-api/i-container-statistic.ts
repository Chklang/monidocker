export interface IContainerStatistic {
    read: string;
    preread: string;
    pids_stats: { current: number };
    blkio_stats: {
        io_service_bytes_recursive: {
            major: number;
            minor: number;
            op: string;
            value: number;
        }[];
        io_serviced_recursive: {
            major: number;
            minor: number;
            op: string;
            value: number;
        }[];
        io_queue_recursive: any[];
        io_service_time_recursive: any[];
        io_wait_time_recursive: any[];
        io_merged_recursive: any[];
        io_time_recursive: any[];
        sectors_recursive: any[];
    };
    num_procs: number[];
    storage_stats: any;
    cpu_stats: {
        cpu_usage: {
            total_usage: number;
            percpu_usage: number[];
            usage_in_kernelmode: number;
            usage_in_usermode: number;
        };
        system_cpu_usage: number;
        online_cpus: number;
        throttling_data: {
            periods: number;
            throttled_periods: number;
            throttled_time: number;
        }
    };
    precpu_stats: {
        cpu_usage: {
            total_usage: number;
            percpu_usage: number[];
            usage_in_kernelmode: number;
            usage_in_usermode: number;
            system_cpu_usage: number;
            online_cpus: number;
            throttling_data: {
                periods: number;
                throttled_periods: number;
                throttled_time: number;
            }
        },
        memory_stats: {
            usage: number;
            max_usage: number;
            stats: {
                active_anon: number;
                active_file: number;
                cache: number;
                dirty: number;
                hierarchical_memory_limit: number;
                hierarchical_memsw_limit: number;
                inactive_anon: number;
                inactive_file: number;
                mapped_file: number;
                pgfault: number;
                pgmajfault: number;
                pgpgin: number;
                pgpgout: number;
                rss: number;
                rss_huge: number;
                total_active_anon: number;
                total_active_file: number;
                total_cache: number;
                total_dirty: number;
                total_inactive_anon: number;
                total_inactive_file: number;
                total_mapped_file: number;
                total_pgfault: number;
                total_pgmajfault: number;
                total_pgpgin: number;
                total_pgpgout: number;
                total_rss: number;
                total_rss_huge: number;
                total_unevictable: number;
                total_writeback: number;
                unevictable: number;
                writeback: number;
            };
            limit: number;
        };
        name: string;
        id: string;
        networks: {
            eth0: {
                rx_bytes: number;
                rx_packets: number;
                rx_errors: number;
                rx_dropped: number;
                tx_bytes: number;
                tx_packets: number;
                tx_errors: number;
                tx_dropped: number;
            }
        }
    }
}