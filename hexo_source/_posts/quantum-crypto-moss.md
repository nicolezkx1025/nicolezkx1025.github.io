---
title: 「 量子破解倒计时：当《流浪地球》MOSS学会暴力穷举时，人类还剩多少安全密码？」
date: 2023-02-19 00:12:28
tags: [tech_notes]
---

&ensp;&ensp;起了一个噱头标题，但严肃来说，这里也是引用的马里兰大学帕克分校的密码学家 Jonathan Katz的说法。  
后量子密码（PQC）破译一个少一个，就像人类在强人工智能面前终将逐步被替代，在最近大火的自然语音处理领域腾空出世也有迹可循，Bert被GPT替代，GPT被chatGPT替代。  
重赏之下，破解这些曾经可靠的密钥只是时间问题。为什么想起来写一篇这样的选题，起因是对流浪地球2里的核密码破解的困难程度感到好奇。

&ensp;&ensp;电影中使用550W超级量子计算机，对剩余核弹的破译时间也还需要700多个小时。在流浪地球的世界观框架下，MOSS同时具有Evil AIs and Angel AIs，所以这700多个小时是那部分Evil AIs有意为之，故意拖延时间的。  
但是这也说明了破译足够有难度的密码也需要大量的时间。  
&ensp;&ensp;那么是什么决定了密码的破译难度呢？为了应对目前现代密码学基于经典计算机设计的加密技术在量子计算机面前不适用的威胁。  
本着一颗好奇心，本系列文章将围绕美国国家标准与技术研究院（NIST）机构近年来研究的，对那些有潜力成为全世界可以采用的新标准算法进行笼统业余的粗略介绍。

&ensp;&ensp;根据一种来自查理芒格的思维方式，凡事可以从反教材入手，我们可以初探一下一开始就败下阵来的算法有什么特点，以及如何避免这样的特点。

&ensp;&ensp;2022年7月5日，NIST公布其后量子密码（PQC）标准化项目第三轮筛选的结果，并公布第四轮候选密钥建立机制的入选算法。  
虽然SIKE因密钥和密文较小具有突出优势，以一度高性价比的可靠表现备受关注，NIST将在第四轮继续进行研究讨论，但在同年7月30日和8月8日，  
SIKE分别被比利时鲁汶大学(KU Leuven)开发的名为Magma的程序和来自布里斯托大学团队设计的一种称为“挠点”(torsion point)的方法一一破解。  
这其中最令人意想不到的是，SIDH是最早实用的基于同源的加密协议之一，而SIKE是它的实例化，这一算法怎么也算的上是21世纪的年轻新星，并且在它诞生的12年里一直给人留下安全性高，简洁高效的印象，这次却在1个月内被攻破两次。事出突然，那么SIKE的算法具体是什么呢，这次的攻击到底是使用了什么先进的数学方法。

&ensp;&ensp;SIKE算法，全称Supersingular Isogeny Key Encapsulation, 一种基于SIDH，即超奇异同源 Diffie-Hellman公钥交换协议的实例。  
Jao和Luca De Feo在一篇Towards Quantum-Resistant Cryptosystems from Supersingular Elliptic Curve Isogenies[^1]提出，刊登在Post-Quantum Cryptography[^2]一书，作者是台湾中央研究院的Bo-Yin Yang。  
该方法可以概括为，假设Alice and Bob两人想要秘密交换信息，但是处于一个不安全的环境下。Alice and Bob抽象为两个图（graph），

####&ensp;&ensp;Overview of SIDH:

&ensp;&ensp;&ensp;&ensp;1. Public parameters: Supersingular elliptic curve E over F p<sup>2</sup>  
   ![img.png](img.png)

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;椭圆曲线 *E* 定义在 *q=p<sup>2</sup>* ，*p* 是素数，其实我感觉这里field是GF有限域

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;超奇异椭圆曲线定义：如果一条定义在 *Fq* 上的椭圆曲线 *E* 的自同态环在 *Fq* 的代数闭包上是不可交换的，那么这个椭圆曲线就被称为超奇异椭圆曲线。

&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;Isogenies同源定义：是指两条椭圆曲线之间的同态，即把一条椭圆曲线上的点映射到另一条椭圆曲线上。  
   举个例子，假如有两条定义在 *Fq* 上的椭圆曲线 *E1* 和 *E2* ，  
   那么映射 *φ:* *φ(P1)=P2*，*P1∈E1*，*P2∈E2* 就可以称作一个同源。

&ensp;&ensp;&ensp;&ensp;2. Alice chooses a kernel A ⊂ E(F p<sup>2</sup>) and sends E/A to Bob.

&ensp;&ensp;&ensp;&ensp;3. Bob chooses a kernel B ⊂ E(F p<sup>2</sup>) and sends E/B to Alice.

&ensp;&ensp;&ensp;&ensp;4. The shared secret is  
E/<A, B> = (E/A)/φ<sub>A</sub>(B) = (E/B)/φ<sub>B</sub>(A). &ensp;&ensp;*# todo 下确界符号查一下怎么打出来*

####&ensp;&ensp;Changes for SIKE:

&ensp;&ensp;&ensp;&ensp;curve *E* : y<sup>2</sup>= x<sup>3</sup> + 6x<sup>2</sup> + x

&ensp;&ensp;
&ensp;&ensp;

####&ensp;&ensp;加载中…… 新坑待填，稍安勿躁。*To Be Continued* ^O^/

&ensp;&ensp;分享一网络笑话，这一段密码，你猜是什么意思？Cindycy1/2ezdgg

&ensp;&ensp;“先帝创业未半而中道崩殂” hhhh

&ensp;&ensp;

[^1]: [Paper: Towards Quantum-Resistant Cryptosystems from Supersingular Elliptic Curve Isogenies](https://link.springer.com/chapter/10.1007/978-3-642-25405-5_2)
[^2]: [Springer LNCS series Book: Post-Quantum Cryptography](https://link.springer.com/book/10.1007/978-3-642-25405-5)
