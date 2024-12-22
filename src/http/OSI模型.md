---
title: OSI 模型
category: http
---

### 学习视频

https://www.bilibili.com/video/BV14x4y1y7jm/?p=129&spm_id_from=pageDriver&vd_source=6b0e1843fccdba1d74c719ad0ade4a49

### 简介

OSI 模型是 Open Systems Interconnection 模型的缩写，它是一个由国际标准化组织（ISO）制定的用于描述计算机网络体系结构的参考模型。OSI 模型将计算机网络通信划分为七个不同的层次，每个层次都有特定的功能和责任。这些层次从下到上依次是：

- 物理层（Physical Layer）：负责传输比特流，即在物理媒介上传输数据的细节，如电压、光信号等。

- 数据链路层（Data Link Layer）：处理节点之间的直接通信，通过帧（Frame）进行数据传输，通常以 MAC 地址识别设备。

- 网络层（Network Layer）：负责**在不同网络之间进行数据传输**，通过**路由器进行数据的转发和选择最佳路径**。比如分组、分包、交互节点这些。

- 传输层（Transport Layer）：提供**端到端的通信和数据传输服务**，主要是 TCP（Transmission Control Protocol）和 UDP（User Datagram Protocol）。

- 会话层（Session Layer）：负责**建立、管理和终止会话连接**，处理**数据交换的顺序和同步**。

- 表示层（Presentation Layer）：负责**数据的格式化、加密和压缩**，以确保 *不同系统间的* **数据格式兼容性**。

- 应用层（Application Layer）：提供用户应用程序访问网络服务的接口，包括 HTTP、FTP、SMTP 等各种应用协议。

**每个层次都使用下一层提供的服务，并向上一层提供服务，形成了一种层层叠加的结构**。这种模型的设计使得不同的厂商可以独立地开发和实现网络设备和协议，同时也提供了一个通用的框架，使得不同的系统能够互相通信。


### 传输过程

