import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import { clientService } from "@/services/api/clientService";
import { projectService } from "@/services/api/projectService";
import { taskService } from "@/services/api/taskService";
import { invoiceService } from "@/services/api/invoiceService";

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalClients: 0,
    activeProjects: 0,
    pendingTasks: 0,
    totalRevenue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        
        const [clients, projects, tasks, invoices] = await Promise.all([
          clientService.getAll(),
          projectService.getAll(),
          taskService.getAll(),
          invoiceService.getAll()
        ]);

        const activeProjects = projects.filter(p => p.status === "In Progress").length;
        const pendingTasks = tasks.filter(t => t.status === "Pending" || t.status === "In Progress").length;
        const paidInvoices = invoices.filter(i => i.status === "Paid");
        const totalRevenue = paidInvoices.reduce((sum, invoice) => sum + invoice.amount, 0);

        setStats({
          totalClients: clients.length,
          activeProjects,
          pendingTasks,
          totalRevenue
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsData = [
    {
      title: "Total Clients",
      value: stats.totalClients,
      icon: "Users",
      color: "primary",
      trend: "+12%",
      trendDirection: "up"
    },
    {
      title: "Active Projects",
      value: stats.activeProjects,
      icon: "FolderOpen",
      color: "info",
      trend: "+8%",
      trendDirection: "up"
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      icon: "CheckSquare",
      color: "warning",
      trend: "-5%",
      trendDirection: "down"
    },
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: "DollarSign",
      color: "success",
      trend: "+15%",
      trendDirection: "up"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {statsData.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <StatCard {...stat} loading={loading} />
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;